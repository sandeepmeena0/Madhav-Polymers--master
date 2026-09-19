 document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.catalog-search-input');
    const productCards = document.querySelectorAll('.product-item-card');
    const resultsCount = document.querySelector('.results-count');

    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        const query = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        productCards.forEach(card => {
          const title = card.querySelector('.item-title')?.textContent.toLowerCase() || '';
          const code = card.querySelector('.item-code-badge')?.textContent.toLowerCase() || '';
          const specs = card.querySelector('.item-specs-grid')?.textContent.toLowerCase() || '';

          // Check if product title, code, or spec contains the searched keyword
          if (title.includes(query) || code.includes(query) || specs.includes(query)) {
            card.style.display = ''; // Show card
            visibleCount++;
          } else {
            card.style.display = 'none'; // Hide card
          }
        });

        // Update total found count
        if (resultsCount) {
          resultsCount.textContent = `${visibleCount} Product${visibleCount === 1 ? '' : 's'} Found`;
        }
      });
    }
  });

  /* ========================================================
   Madhav Polymers — Header / Footer loader
   Include this on every page:
     <div id="header-placeholder"></div>
     ...page content...
     <div id="footer-placeholder"></div>
     <script src="js/include.js"></script>
   ======================================================== */

(function () {
  async function loadInto(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
    }
  }

  function setActiveNavItem() {
    let rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    let current = rawPath.split('/').pop() || 'index';
    current = current.replace(/\.html$/, '');
    if (!current || current === 'index') current = 'index';

    const productSubpages = [
      'rubber-gasket', 'products', 'hand-railing-rubber-gasket',
      'kitchen-and-wardrobe-profiles-rubber-gasket', 'office-partition-system-rubber-gasket',
      'upvc-window-rubber-gasket', 'aluminum-window-rubber-gasket',
      'wedge-and-cord-rubber-gasket', 'tpe-tpv-gaskets', 'curtain-wall', 'aluminium-section'
    ];

    document.querySelectorAll('.main-nav li[data-page]').forEach((li) => {
      let dataPage = (li.getAttribute('data-page') || '').toLowerCase().replace(/\.html$/, '');
      let isActive = (dataPage === current);
      if (dataPage === 'products' && productSubpages.includes(current)) {
        isActive = true;
      }
      li.classList.toggle('active', isActive);
    });
  }

  function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
  }

  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => nav.classList.toggle('open'));

    // When user selects any tab/link, close menu and restore scroll
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        // If it's a dropdown or submenu toggle on mobile/tablet, don't close the drawer
        if (window.innerWidth <= 991 && (link.parentElement.classList.contains('has-dropdown') || link.parentElement.classList.contains('has-submenu'))) {
          e.preventDefault();
          link.parentElement.classList.toggle('open');
          return;
        }
        nav.classList.remove('open');
      });
    });
  }

  function initSearch() {
    const form = document.getElementById('navSearchForm');
    const input = document.getElementById('navSearchInput');
    if (!form || !input) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (!query) return;
      // Sends the visitor to the products page with their search term.
      // Update the target page / param name if you build a dedicated search results page.
      window.location.href = `products.html?q=${encodeURIComponent(query)}`;
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
      loadInto('header-placeholder', 'header.html'),
      loadInto('footer-placeholder', 'footer.html'),
    ]);

    setActiveNavItem();
    initHeaderScroll();
    initMobileMenu();
    initSearch();

    document.dispatchEvent(new CustomEvent('partialsLoaded'));
  });
})();
