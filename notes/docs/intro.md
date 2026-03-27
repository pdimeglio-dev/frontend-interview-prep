---
slug: /
sidebar_position: 1
title: Getting Started
---

# 📝 Study Notes

Welcome to your personal study notes for **Frontend Interview Prep**.

This site is powered by [Docusaurus](https://docusaurus.io/) and lives in the `notes/` directory of the repo. Every page is a Markdown file you can edit freely.

## How to Use

1. **Browse by module** — The sidebar mirrors the 8 modules from the study plan
2. **Take notes** — Each topic has pre-filled summaries + empty sections for your own notes
3. **Link back** — Notes link to the related exercises in the dashboard

## Note Template

Every topic page follows this structure:

- **Summary** — Pre-filled from the study plan (the "what")
- **Key Resources** — Links to articles and videos
- **My Notes** — Empty section for you to fill in as you study
- **Key Takeaways** — Empty section for your own bullet points
- **Related Exercises** — Links back to the dashboard exercises

## Running the Notes Site

```bash
# From the repo root
npm run notes

# Or from the notes/ directory
cd notes && npm start
```

The site runs on **http://localhost:3000** alongside the dashboard on port 3737.

## Adding a New Note

1. Create a new `.md` file in `notes/docs/` (e.g., `notes/docs/module-1/my-new-topic.md`)
2. Add frontmatter at the top:
   ```markdown
   ---
   sidebar_position: 7
   title: My New Topic
   ---
   ```
3. Add the file path to `notes/sidebars.js` under the appropriate module
4. The dev server will hot-reload automatically

---

> **Tip:** You can also use `.mdx` files to embed React components directly in your notes!
