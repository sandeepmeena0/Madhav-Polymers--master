/* ========================================================
   Madhav Polymers — Central JavaScript (js/main.js)
   ======================================================== */
'use strict';

window.mpMainLoaded = true;

// --- Product page URL mapping for search routing ---
const PRODUCT_ROUTES = [
  { page: 'upvc-window-rubber-gasket.html',                    pattern: /ss-|\bupvc\b|\bk.type\b|\bbubble\b|\bcasement\b|\buniversal\b/i },
  { page: 'hand-railing-rubber-gasket.html',                   pattern: /\brailing\b|\bbalustrade\b|\bhand railing\b/i },
  { page: 'kitchen-and-wardrobe-profiles-rubber-gasket.html',  pattern: /\bkitchen\b|\bwardrobe\b|\bcabinet\b/i },
  { page: 'office-partition-system-rubber-gasket.html',        pattern: /\bpartition\b|\boffice\b|\bacoustic\b/i },
  { page: 'aluminum-window-rubber-gasket.html',                pattern: /mp-|\baluminum\b|\baluminium\b/i },
  { page: 'hand-railing-rubber-gasket.html',                   pattern: /^hr-/i },
  { page: 'kitchen-and-wardrobe-profiles-rubber-gasket.html',  pattern: /^kw-/i },
  { page: 'office-partition-system-rubber-gasket.html',        pattern: /^op-/i },
];

// --- 1. WhatsApp Inquiry Form Submission (used by custom-solution page) ---
function handleFormSubmit(event) {
  event.preventDefault();
  const whatsappNumber = '919355761001';
  const get = (id) => (document.getElementById(id)?.value.trim() || '');
  const name    = get('mpName');
  const email   = get('mpEmail');
  const phone   = get('mpPhone') || 'Not provided';
  const details = get('mpDetails');

  const msg = encodeURIComponent(
    `*New Project Inquiry*\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Project Details:* ${details}`
  );

  const successAlert = document.getElementById('mpSuccessAlert');
  if (successAlert) successAlert.style.display = 'block';

  setTimeout(() => window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank'), 400);
}


// ============================================================
// --- 2. Main Initialization ---
// ============================================================
document.addEventListener('DOMContentLoaded', async function () {

  // --- A. Load Header & Footer Partials ---
  async function loadPartial(id, url) {
    const el = document.getElementById(id);
    if (!el || el.querySelector('header, footer')) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
    }
  }

  await Promise.all([
    loadPartial('header-placeholder', 'header.html'),
    loadPartial('footer-placeholder', 'footer.html'),
  ]);

  // --- B. Active Nav Item ---
  function setActiveNavItem() {
    const current = (window.location.pathname.split('/').pop() || 'index').replace(/\.html$/, '') || 'index';
    const productSubpages = [
      'products', 'hand-railing-rubber-gasket', 'kitchen-and-wardrobe-profiles-rubber-gasket',
      'office-partition-system-rubber-gasket', 'upvc-window-rubber-gasket',
      'aluminum-window-rubber-gasket', 'wedge-and-cord-rubber-gasket',
      'tpe-tpv-gaskets', 'curtain-wall', 'aluminium-section'
    ];
    document.querySelectorAll('.main-nav li[data-page]').forEach(li => {
      const dataPage = (li.getAttribute('data-page') || '').replace(/\.html$/, '');
      const active = dataPage === current || (dataPage === 'products' && productSubpages.includes(current));
      li.classList.toggle('active', active);
    });
  }

  // --- C. Header Scroll Effect ---
  function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- D. Mobile Menu ---
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav    = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    const lockScroll   = () => { if (window.innerWidth <= 991) document.documentElement.classList.add('menu-locked'); };
    const unlockScroll = () => document.documentElement.classList.remove('menu-locked');

    toggle.onclick = (e) => {
      e.stopPropagation();
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('active', open);
      open ? lockScroll() : unlockScroll();
    };

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 991 && (link.parentElement.classList.contains('has-dropdown') || link.parentElement.classList.contains('has-submenu'))) {
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

  // --- E. Header Search ---
  function initHeaderSearch() {
    const form  = document.getElementById('navSearchForm');
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
          } else if (!input.value.trim()) {
            e.preventDefault();
            form.classList.remove('search-open');
            input.blur();
          }
        }
      });
    }

    // Rotating placeholder hints — shows user what they can search
    const hints = [
      'Search "UPVC Gasket"...',
      'Search "Hand Railing"...',
      'Search "Kitchen Profile"...',
      'Search "Aluminium Section"...',
      'Search "Office Partition"...',
      'Search "SS-178"...',
      'Search product code e.g. MP-1607...',
    ];
    let hintIndex = 0;
    let hintTimer;
    function cycleHints() {
      if (document.activeElement !== input && !input.value) {
        input.placeholder = hints[hintIndex];
        hintIndex = (hintIndex + 1) % hints.length;
      }
    }
    input.placeholder = hints[0];
    hintTimer = setInterval(cycleHints, 2500);

    input.addEventListener('focus', () => {
      clearInterval(hintTimer);
      input.placeholder = 'Type product name or code...';
      form.classList.add('search-open');
    });
    input.addEventListener('blur',  () => {
      if (!input.value.trim()) {
        form.classList.remove('search-open');
        input.placeholder = hints[hintIndex];
        hintTimer = setInterval(cycleHints, 2500);
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (!query) { input.focus(); return; }

      // If already on a product page — filter in-place and scroll
      const catalogInput = document.querySelector('.catalog-search-input');
      const productGrid  = document.querySelector('.product-grid');
      if (catalogInput && productGrid) {
        catalogInput.value = query;
        catalogInput.dispatchEvent(new Event('input'));
        productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // Route to the best-matching product page
      const matched = PRODUCT_ROUTES.find(r => r.pattern.test(query));
      const target  = matched ? matched.page : 'products.html';
      window.location.href = `${target}?q=${encodeURIComponent(query)}`;
    });
  }

  // --- F. Catalog Live Search (on individual product pages) ---
  function initCatalogSearch() {
    const searchInputs  = document.querySelectorAll('.catalog-search-input, #catalogSearchInput');
    if (!searchInputs.length) return;

    const productCards    = Array.from(document.querySelectorAll('.product-item-card, .product-card'));
    const resultsCountEls = document.querySelectorAll('.results-count, #resultsCount, #resultsCountNum');
    const noResultsMsg    = document.getElementById('noResultsMsg');
    const noResultsTerm   = document.getElementById('noResultsTerm');
    const clearBtn        = document.getElementById('catalogSearchClear');
    const productGrid     = document.querySelector('.product-grid');

    // Pre-compute search text per card — normalize whitespace to catch all text
    const cardData = productCards.map(card => {
      const title    = (card.querySelector('.item-title, h3')?.textContent || '').replace(/\s+/g, ' ').trim();
      const code     = (card.querySelector('.item-code-badge')?.textContent || '').replace(/\s+/g, ' ').trim();
      const specs    = (card.querySelector('.item-specs-grid')?.textContent || '').replace(/\s+/g, ' ').trim();
      const dsearch  = (card.getAttribute('data-search') || '').trim();
      const imgAlt   = (card.querySelector('img')?.getAttribute('alt') || '').trim();
      const fullText = (card.textContent || '').replace(/\s+/g, ' ').trim();

      // Also add version without hyphens so "ss178" matches "SS-178"
      const codeNoHyphen = code.replace(/-/g, '');
      const combined = `${title} ${code} ${codeNoHyphen} ${specs} ${dsearch} ${imgAlt} ${fullText}`.toLowerCase();

      return { el: card, text: combined };
    });

    function performSearch(query) {
      // Strip extra spaces, also try matching without hyphens
      const q = query.toLowerCase().trim().replace(/\s+/g, ' ');
      const qNoHyphen = q.replace(/-/g, '');
      const terms = q.split(' ').filter(Boolean);
      let visibleCount = 0;

      cardData.forEach(({ el, text }) => {
        const matches = terms.length === 0 ||
          terms.every(t => text.includes(t)) ||
          (qNoHyphen.length > 1 && text.includes(qNoHyphen));
        el.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
      });

      resultsCountEls.forEach(el => {
        el.textContent = el.id === 'resultsCountNum'
          ? visibleCount
          : `${visibleCount} Product${visibleCount === 1 ? '' : 's'} Found`;
      });

      if (clearBtn) clearBtn.hidden = (q.length === 0);

      if (noResultsMsg) {
        const show = visibleCount === 0 && q.length > 0;
        noResultsMsg.hidden = !show;
        if (show && noResultsTerm) noResultsTerm.textContent = query.trim();
      }
    }

    searchInputs.forEach(input => {
      input.addEventListener('input', e => performSearch(e.target.value));
      input.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInputs.forEach(i => i.value = '');
        performSearch('');
        searchInputs[0]?.focus();
      });
    }

    // Read ?q= from URL and auto-search
    const qParam = new URLSearchParams(window.location.search).get('q') || new URLSearchParams(window.location.search).get('search');
    if (qParam) {
      searchInputs.forEach(i => i.value = qParam);
      performSearch(qParam);
      if (productGrid) {
        setTimeout(() => productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
      }
    } else {
      performSearch('');
    }
  }

  // --- G. Catalog Sort By ---
  function initCatalogSort() {
    const sortSelects = document.querySelectorAll('.catalog-sort-select, #catalogSortSelect');
    const productGrid = document.querySelector('.product-grid');
    if (!sortSelects.length || !productGrid) return;

    const originalCards = Array.from(productGrid.querySelectorAll('.product-item-card, .product-card'));

    sortSelects.forEach(select => {
      select.addEventListener('change', function () {
        let sorted = [...originalCards];
        if (this.value === 'name') {
          sorted.sort((a, b) =>
            (a.querySelector('.item-title, h3')?.textContent.trim() || '').localeCompare(
             (b.querySelector('.item-title, h3')?.textContent.trim() || ''))
          );
        } else if (this.value === 'code') {
          sorted.sort((a, b) =>
            (a.querySelector('.item-code-badge')?.textContent.trim() || '').localeCompare(
             (b.querySelector('.item-code-badge')?.textContent.trim() || ''))
          );
        }
        productGrid.innerHTML = '';
        sorted.forEach(card => productGrid.appendChild(card));
      });
    });
  }

  // --- H. Grid / List View Toggle ---
  function initViewToggle() {
    const viewBtn     = document.querySelector('.view-btn');
    const productGrid = document.querySelector('.product-grid');
    if (!viewBtn || !productGrid) return;

    viewBtn.addEventListener('click', () => {
      const isList = productGrid.classList.toggle('list-view');
      viewBtn.innerHTML = isList
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg>';
      viewBtn.title = isList ? 'List View' : 'Grid View';
    });
  }

  // --- I. About Section Scroll Animation ---
  function initAboutAnimation() {
    const section = document.getElementById('mpAboutSection');
    if (!section) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        section.classList.add('mp-active');
        observer.disconnect();
      }
    }, { threshold: 0.05 });
    observer.observe(section);
  }

  // --- J. Hero Slider ---
  function initHeroSlider() {
    const slides  = document.querySelectorAll('.hero-slider .slide');
    const prevBtn = document.querySelector('.hero-slider .prev-btn');
    const nextBtn = document.querySelector('.hero-slider .next-btn');
    if (!slides.length || !prevBtn || !nextBtn) return;

    let idx = 0, timer;

    function showSlide(n) {
      slides[idx].classList.remove('active');
      idx = ((n % slides.length) + slides.length) % slides.length;
      slides[idx].classList.add('active');
    }

    function resetTimer() { clearInterval(timer); timer = setInterval(() => showSlide(idx + 1), 6000); }

    nextBtn.addEventListener('click', () => { showSlide(idx + 1); resetTimer(); });
    prevBtn.addEventListener('click', () => { showSlide(idx - 1); resetTimer(); });
    resetTimer();
  }

  // --- K. Quote Modal ---
  function initQuoteModal() {
    function closeModal() {
      const modal = document.getElementById('quoteModal');
      if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
    }

    document.addEventListener('click', (e) => {
      // Open modal on Get Quote button
      const btn = e.target.closest('.btn-quote');
      if (btn) {
        e.preventDefault();
        const modal = document.getElementById('quoteModal');
        if (!modal) return;

        const productInput = document.getElementById('quoteProduct');
        if (productInput) {
          const customProduct = btn.getAttribute('data-product');
          if (customProduct) {
            productInput.value = customProduct;
          } else {
            const card  = btn.closest('.product-item-card, .product-card');
            const title = card?.querySelector('.item-title, h3')?.textContent.trim() || '';
            const code  = card?.querySelector('.item-code-badge')?.textContent.trim() || '';
            productInput.value = title + (code ? ` - ${code}` : '');
          }
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
      }

      // Close modal
      if (e.target.closest('#closeQuoteModal') || e.target.id === 'quoteModal') closeModal();
    });

    document.addEventListener('submit', (e) => {
      if (e.target?.id === 'quoteForm') {
        const btn = e.target.querySelector('button[type="submit"]');
        if (btn) btn.textContent = 'Sending...';
      }
    });
  }

  // --- Run all modules ---
  setActiveNavItem();
  initHeaderScroll();
  initMobileMenu();
  initHeaderSearch();
  initCatalogSearch();
  initCatalogSort();
  initViewToggle();
  initAboutAnimation();
  initHeroSlider();
  initQuoteModal();

  document.dispatchEvent(new CustomEvent('partialsLoaded'));

});
