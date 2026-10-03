// @ts-check
import { defineConfig } from 'astro/config';

// If the repo is named <username>.github.io, the site lives at the root.
// For a repo with any other name, set base: '/<repo-name>'.
export default defineConfig({
  site: 'https://sivabalan21.github.io',
  build: { inlineStylesheets: 'always' },
});
