const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/sande/Downloads/Madhav-Polymers--master';

const criticalCSS = `<style id="critical-css">
/* === CRITICAL CSS: Prevents layout shift & white flash on page load === */

header {
  position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
  background: rgba(11,26,52,0.25);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255,255,255,0.12);
  will-change: background-color, box-shadow;
  transform: translateZ(0); -webkit-transform: translateZ(0);
}
.nav-wrap {
  display: flex; align-items: center; justify-content: space-between;
  max-width: 1180px; margin: 0 auto; padding: 0.9rem 1.4rem; gap: 2rem;
}
.brand {
  display: flex; align-items: center; flex-shrink: 0;
  gap: 0.85rem; text-decoration: none;
}
.brand img { height: 52px; width: auto; display: block; }
.brand-text .name { font-size: 1.38rem; font-weight: 600; white-space: nowrap; }
.brand-text .tag { font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; }
nav.main-nav > ul {
  display: flex; list-style: none; margin: 0; padding: 0;
  gap: 1.4rem; align-items: center;
}
nav.main-nav > ul > li { position: relative; }
nav.main-nav a {
  font-size: 0.93rem; font-weight: 500;
  padding: 0.4rem 0; display: inline-flex; align-items: center;
  gap: 0.3rem; text-decoration: none; white-space: nowrap;
}
.nav-cta { display: flex; align-items: center; }

/* Search bar layout only */
.nav-search {
  position: relative; display: flex; align-items: center;
  border-radius: 50px; padding: 4px 6px 4px 14px; width: 185px;
}
.nav-search__input {
  border: none; background: transparent; outline: none;
  font-size: 0.88rem; width: 100%;
}
.nav-search__icon-btn {
  border: none; width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
}

/* Mobile hamburger — hidden on desktop */
.menu-toggle {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 4px;
}
/* 1024px / Small Desktop / Tablet Landscape */
@media (min-width: 992px) and (max-width: 1200px) {
  .nav-wrap { padding: 0.75rem 1rem; gap: 0.8rem; }
  .brand { gap: 0.5rem; flex-shrink: 0; }
  .brand img { height: 44px; }
  .brand-text .name { font-size: 1.15rem; }
  .brand-text .tag { font-size: 0.56rem; letter-spacing: 0.08em; }
  nav.main-nav > ul { gap: 0.75rem; }
  nav.main-nav a { font-size: 0.84rem; padding: 0.3rem 0; }
  .nav-search { width: 140px; padding: 3px 6px 3px 10px; }
  .nav-search__input { font-size: 0.8rem; }
  .nav-cta { flex-shrink: 0; }
}

@media (max-width: 991px) {
  nav.main-nav > ul { display: none; }
  .menu-toggle { display: flex; }
  .nav-wrap { padding: 0.75rem 1.4rem; gap: 0.7rem; }
  .nav-cta { margin-left: auto; }
  .nav-search { width: 36px; overflow: hidden; padding: 4px; justify-content: center; }
  .nav-search__input { width: 0; opacity: 0; padding: 0; pointer-events: none; }
  .nav-search.search-open { width: 170px; padding: 4px 6px 4px 14px; }
  .nav-search.search-open .nav-search__input { width: 100%; opacity: 1; pointer-events: auto; }
}
@media (max-width: 768px) {
  .brand img { height: 44px; }
  .brand-text .name { font-size: 1.2rem; }
}
@media (max-width: 440px) {
  .nav-wrap { padding: 0.65rem 0.85rem; gap: 0.5rem; }
}
</style>`;

const skip = new Set(['header.html', 'footer.html', 'generated_select.html']);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !skip.has(f));

let updated = 0;
files.forEach(file => {
  const fp = path.join(dir, file);
  let html = fs.readFileSync(fp, 'utf8');
  // Remove any existing critical-css block
  html = html.replace(/<style id="critical-css">[\s\S]*?<\/style>\s*/g, '');
  // Insert right after <head>
  html = html.replace(/(<head[^>]*>)(\r?\n)?/, (m, tag, nl) => tag + (nl || '\n') + criticalCSS + '\n');
  fs.writeFileSync(fp, html);
  updated++;
  console.log('✔ ' + file);
});

console.log('\nDone — updated ' + updated + ' files');
