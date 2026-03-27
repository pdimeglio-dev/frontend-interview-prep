# 📝 Study Notes — Docusaurus Site

A personal study notes site built with [Docusaurus 3](https://docusaurus.io/), integrated with the main dashboard.

## Quick Start

```bash
# From the repo root
npm run notes          # → http://localhost:3000
npm run dashboard      # → http://localhost:3737 (separate terminal)

# Or from inside this directory
cd notes && npm start
```

---

## How to Add a New Note

### 1. Create the Markdown file

Create a `.md` file inside `notes/docs/`. Place it in an existing module folder, or create a new folder.

**Example:** Adding a note about "Web Workers" to Module 7:

```bash
# Create the file
touch notes/docs/module-7/web-workers.md
```

### 2. Add frontmatter

Every note needs a YAML frontmatter block at the top:

```markdown
---
sidebar_position: 6
title: "Web Workers"
---

# Web Workers

## Summary

Web Workers run scripts in background threads...

## Key Resources

- 📖 [MDN — Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

## My Notes

<!-- Your notes here -->

## Key Takeaways

<!-- Bullet points -->

## Related Exercises

- 🏋️ [08-virtual-list](http://localhost:3737/exercise/08-virtual-list) — Could offload calculations to a worker
```

| Frontmatter Field | Purpose |
|---|---|
| `sidebar_position` | Order within its category (1 = first) |
| `title` | Display name in the sidebar |

### 3. Register in the sidebar

Open `notes/sidebars.js` and add the file path to the appropriate module category:

```javascript
{
  type: "category",
  label: "🖼️ Module 7: DOM Performance",
  items: [
    "module-7/browser-rendering",
    "module-7/reflow-layout-thrashing",
    "module-7/css-position",
    "module-7/scroll-events",
    "module-7/core-web-vitals",
    "module-7/web-workers",       // ← ADD THIS LINE
  ],
},
```

The string is the **file path relative to `docs/`**, without the `.md` extension.

### 4. Done!

If the dev server is running (`npm run notes`), it hot-reloads automatically. Your new note appears in the sidebar.

---

## How to Group Notes

Notes are grouped into **categories** (folders) in the sidebar. The structure is:

```
notes/docs/
├── intro.md                    ← Top-level page
├── module-1/                   ← Category folder
│   ├── closures.md
│   ├── this-keyword.md
│   └── ...
├── module-2/
│   ├── closures-caching.md
│   └── ...
└── my-custom-topic/            ← You can create new categories!
    ├── design-patterns.md
    └── system-design.md
```

### Adding a new category

1. **Create a folder** inside `notes/docs/`:

   ```bash
   mkdir notes/docs/system-design
   ```

2. **Add notes** inside it (with frontmatter as shown above).

3. **Register the category** in `notes/sidebars.js`:

   ```javascript
   // Add to the notesSidebar array in sidebars.js
   {
     type: "category",
     label: "🏗️ System Design",    // Display name + emoji
     collapsed: true,               // Start collapsed (false = expanded)
     items: [
       "system-design/news-feed",   // → docs/system-design/news-feed.md
       "system-design/chat-app",    // → docs/system-design/chat-app.md
     ],
   },
   ```

### Sidebar item types

| Type | Syntax | Use Case |
|---|---|---|
| **Doc link** | `"module-1/closures"` | Link to a specific `.md` file |
| **Category** | `{ type: "category", label: "...", items: [...] }` | Collapsible folder of docs |
| **External link** | `{ type: "link", label: "...", href: "https://..." }` | Link to an external site |

---

## How to Link a Note to the Dashboard

The dashboard shows a 📝 icon next to each concept that links to its corresponding notes page. To connect a new note:

### Step 1: Know the Docusaurus URL

Your note's URL follows this pattern:

```
http://localhost:3000/docs/{folder}/{filename-without-extension}
```

**Examples:**
| File | URL |
|---|---|
| `docs/module-1/closures.md` | `http://localhost:3000/docs/module-1/closures` |
| `docs/module-7/web-workers.md` | `http://localhost:3000/docs/module-7/web-workers` |
| `docs/system-design/news-feed.md` | `http://localhost:3000/docs/system-design/news-feed` |

### Step 2: Add to the NOTES_MAP in the dashboard

Open `dashboard/index.html` and find the `NOTES_MAP` object (search for `NOTES_MAP`):

```javascript
const NOTES_MAP = {
  'mod1-closures': 'module-1/closures',
  'mod1-this': 'module-1/this-keyword',
  // ... existing entries ...

  // ← ADD YOUR NEW ENTRY HERE
  'mod7-web-workers': 'module-7/web-workers',
};
```

The **key** is a unique ID (matching the concept's `id` in the `MODULES` array), and the **value** is the Docusaurus docs path (without `http://localhost:3000/docs/` prefix).

### Step 3: Add the concept to MODULES (if it's a new concept)

If you're adding a completely new concept that doesn't exist in the dashboard yet, add it to the appropriate module in the `MODULES` array:

```javascript
{
  id: 'mod7',
  num: 7,
  title: 'The "DOM Performance" Master',
  emoji: '🖼️',
  exercises: ['08-virtual-list'],
  concepts: [
    // ... existing concepts ...
    {
      id: 'mod7-web-workers',        // ← Must match NOTES_MAP key
      name: 'Web Workers',
      desc: 'Run scripts in background threads for heavy computation.',
      links: [
        { type: 'read', label: 'MDN — Web Workers', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API' },
      ]
    },
  ]
},
```

The 📝 icon will automatically appear next to the concept name if:
- The concept's `id` exists as a key in `NOTES_MAP`
- The notes dev server is running on port 3000

---

## File Reference

| File | Purpose |
|---|---|
| `notes/package.json` | Docusaurus dependencies (separate from root) |
| `notes/docusaurus.config.js` | Site config: title, navbar, theme, prism languages |
| `notes/sidebars.js` | Sidebar structure: categories and page ordering |
| `notes/src/css/custom.css` | Custom styles (dark theme colors, badges) |
| `notes/docs/intro.md` | Landing page at `/docs` |
| `notes/docs/module-*/` | Note pages organized by module |
| `dashboard/index.html` | Dashboard with `NOTES_MAP` linking to notes |

## Useful Commands

```bash
npm run notes           # Start dev server (hot reload)
npm run notes:build     # Build static site for deployment
npm run notes:install   # Install/update Docusaurus dependencies
```
