import { createServer } from "node:http";
import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const PORT = 3737;

// Map exercise folder → main source file
async function getExerciseFiles(name) {
  const dir = join(SRC, name);
  const files = await readdir(dir);
  const readme = files.find(f => f === 'README.md');
  const source = files.find(f => /^(?:index|[A-Z]\w+)\.(ts|tsx)$/.test(f) && !f.includes('.test.') && !f.includes('.stories.'));
  const test = files.find(f => f.includes('.test.'));
  const stories = files.find(f => f.includes('.stories.'));
  return { dir, readme, source, test, stories, allFiles: files };
}

async function listExercises() {
  const entries = await readdir(SRC);
  const exercises = [];
  for (const name of entries.sort()) {
    const s = await stat(join(SRC, name));
    if (s.isDirectory()) {
      const info = await getExerciseFiles(name);
      exercises.push({ name, files: info.allFiles, source: info.source, test: info.test, readme: !!info.readme, stories: info.stories });
    }
  }
  return exercises;
}

function getTestResults() {
  try {
    const output = execSync("npx vitest run --reporter=json 2>/dev/null", {
      cwd: ROOT,
      encoding: "utf-8",
      timeout: 60000,
    });
    // vitest JSON output may have non-JSON lines before it; find the JSON
    const jsonStart = output.indexOf("{");
    if (jsonStart === -1) return { error: "No JSON output from vitest" };
    const json = JSON.parse(output.slice(jsonStart));

    // Map to exercise results
    const exercises = {};
    for (const file of json.testResults || []) {
      // Extract exercise folder name like "01-debounce"
      const match = file.name.match(/src\/([\w-]+)\//);
      if (!match) continue;
      const name = match[1];
      const total = file.assertionResults?.length || 0;
      const passed = file.assertionResults?.filter(
        (t) => t.status === "passed"
      ).length || 0;
      const failed = total - passed;
      exercises[name] = {
        total,
        passed,
        failed,
        status: failed === 0 && total > 0 ? "pass" : "fail",
        tests: (file.assertionResults || []).map((t) => ({
          name: t.fullName || t.title,
          status: t.status,
        })),
      };
    }
    return { exercises };
  } catch (err) {
    // vitest exits with code 1 when tests fail — still has valid JSON on stdout
    const stdout = err.stdout || "";
    const jsonStart = stdout.indexOf("{");
    if (jsonStart >= 0) {
      try {
        const json = JSON.parse(stdout.slice(jsonStart));
        const exercises = {};
        for (const file of json.testResults || []) {
          const match = file.name.match(/src\/([\w-]+)\//);
          if (!match) continue;
          const name = match[1];
          const total = file.assertionResults?.length || 0;
          const passed = file.assertionResults?.filter(
            (t) => t.status === "passed"
          ).length || 0;
          const failed = total - passed;
          exercises[name] = {
            total,
            passed,
            failed,
            status: failed === 0 && total > 0 ? "pass" : "fail",
            tests: (file.assertionResults || []).map((t) => ({
              name: t.fullName || t.title,
              status: t.status,
            })),
          };
        }
        return { exercises };
      } catch {
        /* fall through */
      }
    }
    return { error: "Failed to run tests", detail: err.message };
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  // ── API: full test results ──
  if (path === "/api/test-results") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getTestResults()));
    return;
  }

  // ── API: list exercises ──
  if (path === "/api/exercises") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(await listExercises()));
    return;
  }

  // ── API: save exercise source file ──
  const saveMatch = path.match(/^\/api\/exercise\/([\w-]+)\/(source|test)$/);
  if (saveMatch && req.method === 'PUT') {
    const [, name, type] = saveMatch;
    try {
      const info = await getExerciseFiles(name);
      const filename = type === 'source' ? info.source : info.test;
      if (!filename) { res.writeHead(404, { "Content-Type": "application/json" }); res.end(JSON.stringify({ error: 'File not found' })); return; }
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });
      await writeFile(join(info.dir, filename), body, 'utf-8');
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ── API: exercise file content ──
  const fileMatch = path.match(/^\/api\/exercise\/([\w-]+)\/(readme|source|test|stories)$/);
  if (fileMatch) {
    const [, name, type] = fileMatch;
    try {
      const info = await getExerciseFiles(name);
      const fileMap = { readme: info.readme, source: info.source, test: info.test, stories: info.stories };
      const filename = fileMap[type];
      if (!filename) { res.writeHead(404); res.end('File not found'); return; }
      const content = await readFile(join(info.dir, filename), 'utf-8');
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Exercise not found');
    }
    return;
  }

  // ── API: run tests for single exercise ──
  const testMatch = path.match(/^\/api\/exercise\/([\w-]+)\/run$/);
  if (testMatch) {
    const name = testMatch[1];
    try {
      const info = await getExerciseFiles(name);
      const testFile = info.test;
      if (!testFile) { res.writeHead(404, { "Content-Type": "application/json" }); res.end(JSON.stringify({ error: 'No test file' })); return; }
      let stdout = '';
      try {
        stdout = execSync(`npx vitest run src/${name}/${testFile} --reporter=json 2>/dev/null`, { cwd: ROOT, encoding: 'utf-8', timeout: 30000 });
      } catch (err) {
        stdout = err.stdout || '';
      }
      const jsonStart = stdout.indexOf('{');
      if (jsonStart >= 0) {
        const json = JSON.parse(stdout.slice(jsonStart));
        const file = json.testResults?.[0];
        const total = file?.assertionResults?.length || 0;
        const passed = file?.assertionResults?.filter(t => t.status === 'passed').length || 0;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          total, passed, failed: total - passed,
          status: (total - passed) === 0 && total > 0 ? 'pass' : 'fail',
          tests: (file?.assertionResults || []).map(t => ({ name: t.fullName || t.title, status: t.status, failureMessages: t.failureMessages || [] })),
        }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: 'No JSON output', raw: stdout.slice(0, 500) }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ── Serve exercise detail page ──
  if (path.match(/^\/exercise\/([\w-]+)$/)) {
    const html = await readFile(join(__dirname, "exercise.html"), "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  // ── Serve the dashboard HTML ──
  if (path === "/" || path === "/index.html") {
    const html = await readFile(join(__dirname, "index.html"), "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\n  🎓 Frontend Interview Prep Dashboard`);
  console.log(`  ────────────────────────────────────`);
  console.log(`  → http://localhost:${PORT}\n`);
});
