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
| Currently, metrics, skills, coursework | `src/data/site.ts` |
| Project diagrams | `src/components/diagrams/` |
| Company and school logos | `public/logos/` (see below) |
| Project case studies | `src/content/projects/*.md` |
| Home page intro and experience summary | `src/pages/index.astro` |
| Full experience | `src/pages/experience.astro` |
| About page | `src/pages/about.astro` |
| Resume PDF | `public/resume.pdf` (replace the file to update) |
| Colors and type | `src/styles/global.css` |

## Projects

Each project is a Markdown file. The frontmatter controls the list, the case study header, and the timeline:

- `order` sets the position in the project list.
- `links` takes `{ label, href }` entries, e.g. GitHub, Demo, Report.
- `draft: true` hides it.

Open items are marked with `<!-- TODO -->` comments. They don't render on the site.

Images: put them in `public/images/` and reference them as `![alt](/images/name.png)`.

## Writing

Add Markdown files to `src/content/writing/`. The Writing link appears in the nav automatically once there is at least one post with `draft: false`. Files starting with `_` are ignored.

## Logos

Add official logo files to `public/logos/` with these names (svg, png, or webp):

- `ezee.svg` for Veefin / Ezee.ai
- `nyu.svg` for NYU
- `amrita.svg` for Amrita (optional)

They show at 28px next to the matching entries. Until a file exists, nothing renders, so there's never a broken image.

## Fonts

Fonts are self-hosted through Fontsource (Newsreader for headings, IBM Plex Sans for text, IBM Plex Mono for code and stack lists), so there are no requests to Google Fonts.
