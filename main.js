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

    function lockScroll() {
      if (window.innerWidth <= 991) {
        document.body.classList.add('menu-locked');
        document.documentElement.classList.add('menu-locked');
      }
    }

    function unlockScroll() {
      document.body.classList.remove('menu-locked');
      document.documentElement.classList.remove('menu-locked');
    }

    toggle.onclick = (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      if (isOpen) {
        lockScroll();
      } else {
        unlockScroll();
      }
    };

    // When user selects any tab/link, close menu and restore scroll
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        // If it's a dropdown toggle on mobile/tablet, don't close the drawer
        if (window.innerWidth <= 991 && link.parentElement.classList.contains('has-dropdown')) {
          e.preventDefault();
          link.parentElement.classList.toggle('open');
          return;
        }
        nav.classList.remove('open');
        toggle.classList.remove('active');
        unlockScroll();
      });
    });
  }

  function initSearch() {
    const form = document.getElementById('navSearchForm');
    const input = document.getElementById('navSearchInput');
    if (!form || !input) return;

    const iconBtn = form.querySelector('.nav-search__icon-btn');
    if (iconBtn) {
      iconBtn.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
          if (!form.classList.contains('search-open')) {
            e.preventDefault();
            form.classList.add('search-open');
            input.focus();
            return;
          } else if (!input.value.trim()) {
            e.preventDefault();
            form.classList.remove('search-open');
            input.blur();
            return;
          }
        }
      });
    }

    input.addEventListener('focus', () => {
      form.classList.add('search-open');
    });

    input.addEventListener('blur', () => {
      if (!input.value.trim()) {
        form.classList.remove('search-open');
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (!query) {
        input.focus();
        return;
      }
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
