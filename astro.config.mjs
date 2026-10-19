import { defineConfig } from 'astro/config';

// GitHub Actions supplies the owner and repository. Local development uses /.
const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
const projectRepo = repo && repo.toLowerCase() !== `${owner}.github.io`.toLowerCase();
const production = process.env.PUBLISH_ENV === 'production';
const base = process.env.SITE_BASE || (!production && projectRepo ? `/${repo}/` : '/');
const site = process.env.SITE_URL || (owner ? `https://${owner}.github.io` : 'http://localhost:4321');

export default defineConfig({
  output: 'static',
  site,
  base,
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
  vite: { build: { assetsInlineLimit: 0 } },
  devToolbar: { enabled: false },
});
