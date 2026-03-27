# Dashboard & Editor — Architecture

> How the exercise editor detects file changes, syncs with disk, and orchestrates the editing workflow.

---

## High-Level Overview

The dashboard is a self-contained, zero-build web app made of three pieces:

| File | Role |
|---|---|
| `server.js` | Node.js HTTP server — serves HTML, exposes REST API, watches the filesystem |
| `index.html` | Dashboard home — lists all exercises, tracks reading/test progress |
| `exercise.html` | 3-panel exercise editor — description ∙ code editor ∙ test results |

The server runs on **port 3737**. There is no bundler, no framework on the server — just `node:http`, `node:fs`, and `node:child_process`.

---

## The Exercise Editor (exercise.html)

A single-page 3-panel layout:

```
┌──────────────────────────────────────────────────────────┐
│  ◀ Prev   #01 — Debounce                  Next ▶  💾 ▶  │  ← topbar
├────────────┬───────────────────┬─────────────────────────┤
│            │                   │                         │
│ 📋 README  │  ✏️ Code (CM5)    │  🧪 Test Results         │
│  (30%)     │   (42%)          │   (28%)                 │
│            │  [Solution|Tests] │                         │
│  Markdown  │  tabs             │  ▶ Run Tests output     │
│            │                   │                         │
└────────────┴───────────────────┴─────────────────────────┘
```

- **Panel 1 — Description**: Fetches `/api/exercise/{name}/readme`, renders with `marked.js`.
- **Panel 2 — Code Editor**: Uses **CodeMirror 5** for the `source` tab (editable) and **Prism.js** for the `test` tab (read-only). The user can only edit the solution file.
- **Panel 3 — Test Results**: Displays output from running `vitest` for that exercise.

---

## How File-Change Detection Works

### Polling for Disk Changes

The editor polls the server every **1.5 seconds** to detect external changes (e.g., the user edits the file in VS Code while the dashboard is open).

#### Flow

```
exercise.html                          server.js                        Disk
     │                                     │                              │
     │─── GET /api/exercise/01-debounce/source ──→│                       │
     │                                     │──── readFile() ─────────────→│
     │                                     │←──── file contents ──────────│
     │←── 200 "export function debounce…"──│                              │
     │                                     │                              │
     │  compare response vs savedCache.source                             │
     │  if different → handleExternalFileChange()                         │
     │                                     │                              │
     │  … 1.5s later, repeat …                                           │
```

#### Key Code (client — `exercise.html`)

```js
// FILE POLLING (checks disk every 1.5s)
function startWatching(exerciseName) {
  if (pollTimer) clearInterval(pollTimer);

  pollTimer = setInterval(async () => {
    // Skip poll right after our own save
    if (ignoreNextPoll) { ignoreNextPoll = false; return; }

    const diskSource = await fetchText(`/api/exercise/${exerciseName}/source`);
    if (diskSource !== null && diskSource !== savedCache.source) {
      handleExternalFileChange('source', diskSource);
    }

    const diskTest = await fetchText(`/api/exercise/${exerciseName}/test`);
    if (diskTest !== null && diskTest !== savedCache.test) {
      handleExternalFileChange('test', diskTest);
    }
  }, 1500);
}
```

#### What happens when a change is detected

`handleExternalFileChange(type, content)` handles two cases:

| Scenario | Behavior |
|---|---|
| **User has NO unsaved edits** (`isDirty === false`) | The editor content is silently replaced. Cursor position and scroll are preserved. A toast says *"↻ File updated from disk"*. |
| **User HAS unsaved edits** (`isDirty === true`) | The editor is **not** touched. A warning toast says *"⚠ File changed externally (you have unsaved edits)"*. The `savedCache` is updated so the next save will overwrite disk. |
| **Test file changed** (any tab) | `codeCache.test` is updated. If the Tests tab is active, it re-renders immediately. |

#### Avoiding self-triggered polls

When the user saves via the editor (⌘S or the Save button), the save handler sets `ignoreNextPoll = true`. The next polling cycle sees this flag, resets it, and skips the fetch. This prevents a round-trip where our own write is detected as an "external" change.

```js
async function saveFile() {
  // ...
  ignoreNextPoll = true;  // ← tell poller to skip one cycle
  await fetch(`/api/exercise/${currentExercise}/source`, {
    method: 'PUT',
    body: content,
  });
  savedCache.source = content;  // ← update baseline
  // ...
}
```

---

## Saving Files

When the user hits **⌘S** (or clicks Save):

```
exercise.html                        server.js                         Disk
     │                                   │                               │
     │  ignoreNextPoll = true            │                               │
     │                                   │                               │
     │── PUT /api/exercise/01-debounce/source ──→│                       │
     │   body: "export function debounce…"       │                       │
     │                                   │────── writeFile() ───────────→│
     │                                   │←───── ok ─────────────────────│
     │←── 200 { ok: true } ─────────────│                               │
     │                                   │                               │
     │  savedCache.source = content      │                               │
     │  setDirty(false)                  │                               │
     │  showToast("✓ File saved")        │                               │
```

The server endpoint is simple:

```js
// PUT /api/exercise/:name/source
const body = await readRequestBody(req);
await writeFile(join(info.dir, info.source), body, 'utf-8');
res.end(JSON.stringify({ ok: true }));
```

---

## Running Tests

When the user clicks **▶ Run Tests**:

1. If there are unsaved changes, the editor **auto-saves first** (`await saveFile()`).
2. The client calls `GET /api/exercise/{name}/run`.
3. The server runs `npx vitest run src/{name}/{testFile} --reporter=json` synchronously via `execSync` (30s timeout).
4. Vitest JSON output is parsed and returned as structured test results.
5. The client renders pass/fail badges and failure messages.

```
exercise.html           server.js                    vitest
     │                       │                          │
     │── GET /run ──────────→│                          │
     │                       │── execSync("npx vitest") │
     │                       │                    ──────→│
     │                       │                    ←──────│ JSON output
     │                       │  parse JSON               │
     │←── { passed, failed,  │                          │
     │      tests: [...] } ──│                          │
```

---

## State Management (Client)

The editor tracks several pieces of state:

| Variable | Purpose |
|---|---|
| `codeCache` | `{ source: string, test: string }` — current content for each tab (may include unsaved edits) |
| `savedCache` | `{ source: string, test: string }` — last known content that matches disk |
| `isDirty` | `true` if `codeCache.source !== savedCache.source` |
| `ignoreNextPoll` | `true` for one poll cycle after a save to avoid self-detection |
| `pollTimer` | The `setInterval` ID for the 1.5s polling loop |
| `editor` | The CodeMirror 5 instance (only exists when viewing the Source tab) |

### Dirty tracking

Every keystroke in CodeMirror fires its `change` event:

```js
editor.on('change', () => {
  codeCache.source = editor.getValue();
  setDirty(editor.getValue() !== savedCache.source);
});
```

`setDirty()` updates the Save button appearance (green → amber when dirty) and prepends `●` to the page title (like VS Code does for unsaved files).

---

## Lifecycle of an Exercise Page

```
1. init()
   ├── Parse exercise name from URL (/exercise/01-debounce)
   ├── Fetch exercise list for prev/next navigation
   ├── Register global ⌘S keyboard shortcut
   └── loadExercise(name)
        ├── Fetch README, source, test in parallel
        ├── Render markdown description
        ├── Initialize CodeMirror editor with source code
        ├── Reset test results panel
        └── startWatching(name)   ← begins 1.5s polling loop

2. User edits code
   ├── CodeMirror 'change' → codeCache updated, dirty flag set
   └── Save button turns amber

3. User saves (⌘S)
   ├── ignoreNextPoll = true
   ├── PUT /api/exercise/{name}/source
   ├── savedCache.source = content
   └── setDirty(false)

4. Polling cycle (every 1.5s)
   ├── If ignoreNextPoll → skip, reset flag
   ├── Fetch source and test from server
   ├── Compare against savedCache
   └── If different → handleExternalFileChange()

5. User clicks "Run Tests"
   ├── Auto-save if dirty
   ├── GET /api/exercise/{name}/run
   └── Render results in panel 3

6. User navigates away
   └── Page unloads, pollTimer is abandoned (no explicit cleanup needed)
```

---

## Server API Reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/exercises` | List all exercise folders with metadata |
| `GET` | `/api/exercise/:name/readme` | Raw README.md content |
| `GET` | `/api/exercise/:name/source` | Raw source file content |
| `GET` | `/api/exercise/:name/test` | Raw test file content |
| `GET` | `/api/exercise/:name/stories` | Raw stories file content |
| `PUT` | `/api/exercise/:name/source` | Write body to source file |
| `PUT` | `/api/exercise/:name/test` | Write body to test file |
| `GET` | `/api/exercise/:name/run` | Run vitest for this exercise, return JSON results |
| `GET` | `/api/test-results` | Run ALL tests, return aggregated JSON results |
