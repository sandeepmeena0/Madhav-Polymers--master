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
    // Current file name, e.g. "about.html" (defaults to index.html for "/" )
    let current = window.location.pathname.split('/').pop();
    if (!current) current = 'index.html';

    document.querySelectorAll('.main-nav li[data-page]').forEach((li) => {
      li.classList.toggle('active', li.getAttribute('data-page') === current);
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

    // Tap a dropdown label on mobile to expand it instead of following the link
    document.querySelectorAll('.has-dropdown > a').forEach((link) => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 680) {
          e.preventDefault();
          link.parentElement.classList.toggle('open');
        }
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
