const fs = require('node:fs');
const path = require('node:path');

const distDir = path.join(__dirname, 'dist');
const newsDir = path.join(distDir, 'noticias');

function firstBuiltArticleUrl() {
  if (!fs.existsSync(newsDir)) return null;
  const slug = fs.readdirSync(newsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(newsDir, entry.name, 'index.html')))
    .map((entry) => entry.name)
    .sort()[0];
  return slug ? `http://localhost/noticias/${slug}/` : null;
}

const urls = [
  'http://localhost/',
  'http://localhost/editorias.html',
  firstBuiltArticleUrl(),
].filter(Boolean);

const median = (thresholds) => ({ ...thresholds, aggregationMethod: 'median' });

module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: urls,
      // Lighthouse is noisy on shared CI runners. Five runs + median is the
      // jitter policy: a single slow/noisy run must not fail the build.
      numberOfRuns: 5,
      settings: {
        chromeFlags: '--headless=new --no-sandbox',
      },
    },
    assert: {
      assertions: {
        // SEO is the blocking Lighthouse contract. The deterministic HTML
        // checker remains stricter for individual metadata invariants.
        'categories:seo': ['error', median({ minScore: 0.9 })],

        // Keep the other quality dimensions visible without making ordinary
        // runner variance a publication blocker while baselines are gathered.
        'categories:performance': ['warn', median({ minScore: 0.8 })],
        'categories:accessibility': ['warn', median({ minScore: 0.9 })],
        'categories:best-practices': ['warn', median({ minScore: 0.9 })],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-results',
    },
  },
};
