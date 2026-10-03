# sivabalan21.github.io

Personal site built with [Astro](https://astro.build), deployed to GitHub Pages.

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build in dist/
```

## Deploy (one-time setup)

1. Create a public GitHub repo named exactly `sivabalan21.github.io`.
2. Push this folder to its `main` branch.
3. In the repo: Settings → Pages → Build and deployment → Source: **GitHub Actions**.
4. Every push to `main` rebuilds and deploys via `.github/workflows/deploy.yml`.

The site will be live at https://sivabalan21.github.io

## Where things live

| What | File |
|---|---|
| Name, email, links | `src/data/site.ts` |
| Work/study spans on the timeline | `src/data/site.ts` (`traceSpans`) |
| Project case studies | `src/content/projects/*.md` |
| Home page intro and experience summary | `src/pages/index.astro` |
| Full experience | `src/pages/experience.astro` |
| About page | `src/pages/about.astro` |
| Resume PDF | `public/resume.pdf` (replace the file to update) |
| Colors and type | `src/styles/global.css` |

## Projects

Each project is a Markdown file. The frontmatter controls the list, the case study header, and the timeline:

- `order` sets the position in the project list.
- `start` / `end` (`"YYYY-MM"`, end inclusive) place it on the timeline.
- `short` is the label on the timeline.
- `links` takes `{ label, href }` entries, e.g. GitHub, Demo, Report.
- `draft: true` hides it.

Open items are marked with `<!-- TODO -->` comments. They don't render on the site.

Images: put them in `public/images/` and reference them as `![alt](/images/name.png)`.

## Writing

Add Markdown files to `src/content/writing/`. The Writing link appears in the nav automatically once there is at least one post with `draft: false`. Files starting with `_` are ignored.
