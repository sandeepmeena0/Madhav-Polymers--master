/* ========================================================
   Madhav Polymers — Central JavaScript (js/main.js)
   ======================================================== */
'use strict';

window.mpMainLoaded = true;

// --- Product page URL mapping for search routing by Name, Slug, Short Name & Product Code ---
const PRODUCT_ROUTES = [
  // 1. Hand Railing Rubber Gasket (hand, rail, balus, hr, MP-1607..1636, 1607..1636)
  { 
    page: 'hand-railing-rubber-gasket.html', 
    pattern: /hand|rail|balus|glass\s*rail|\bhr\b|\bmp-?16|160[789]|161[02345678]|162[056]|1636/i 
  },
  // 2. Kitchen & Wardrobe Profiles (kitch, ward, cabin, drawer, cupb, prof, kw, MP-1502..1543, 1502..1543)
  { 
    page: 'kitchen-and-wardrobe-profiles-rubber-gasket.html', 
    pattern: /kitch|ward|cabin|drawer|cupb|prof|\bkw\b|\bmp-?15|p-?15|150[236]|151[01489]|1543/i 
  },
  // 3. Office Partition System (off, part, acoust, cubic, op, MP-2004..2040, 2004..2040, 1033, 1046)
  { 
    page: 'office-partition-system-rubber-gasket.html', 
    pattern: /\boff|part|acoust|cubic|\bop\b|\bmp-?20|200[459]|2010|202[03456]|2034|2040|1033|1046/i 
  },
  // 4. uPVC Window Rubber Gasket (upv, upvc, pvc, u-pvc, k-type, casem, univ, SS-178..258, 178..258)
  { 
    page: 'upvc-window-rubber-gasket.html', 
    pattern: /upv|u-pvc|\bpvc\b|k[\s-]*type|casem|univ|ss-?(178|188|198|199|221|222|228|229|230|231|233|234|237|238|241|242|243|257|258)|\b(178|188|198|199|221|222|228|229|230|231|233|234|237|238|241|242|243|257|258)\b/i 
  },
  // 5. Aluminum Window Rubber Gasket (al, alu, alum, alumi, aluminum, aluminium, SS-100..142, 100..142)
  { 
    page: 'aluminum-window-rubber-gasket.html', 
    pattern: /alum|alumi|al\s*wind|\balu\b|\bal\b|ss-?(10[0-79]|12[0-367]|14[012](-5)?)|\b(10[0-79]|12[0-367]|14[012])\b/i 
  },
  // Fallbacks
  { page: 'upvc-window-rubber-gasket.html', pattern: /\bss-/i },
  { page: 'hand-railing-rubber-gasket.html', pattern: /\bhr-/i },
  { page: 'kitchen-and-wardrobe-profiles-rubber-gasket.html', pattern: /\bkw-/i },
  { page: 'office-partition-system-rubber-gasket.html', pattern: /\bop-/i },
  { page: 'aluminum-window-rubber-gasket.html', pattern: /\bmp-/i }
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

    // Rotating placeholder hints
    const hints = [
      'Search "UPVC Gasket"...',
      'Search "Hand Railing"...',
      'Search "Kitchen Profile"...',
      'Search "Office Partition"...',
      'Search "Aluminum Window"...',
      'Search "SS-178" or "178"...',
      'Search "MP-1607" or "1607"...',
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

    // Helper: Check if query is a broad category term rather than a specific item code/name
    const isCategoryOnly = (q) => {
      const norm = q.toLowerCase().replace(/[-_]/g, ' ').trim();
      const catRegex = /^(hand\s*railing|handrail|railing|rail|hand|balustrade|glass\s*railing|hr|kitchen\s*and\s*wardrobe|kitchen\s*&?\s*wardrobe|kitchen|wardrobe|profiles?|cabinet|drawer|cupboard|kw|office\s*partition|office|partition|acoustic|cubicle|op|upvc\s*window|upvc|u\s*pvc|pvc|aluminum\s*window|aluminium\s*window|aluminum|aluminium|alu|alum|al\s*window|al|rubber\s*gasket|gasket|rubber|all|products?)$/i;
      return catRegex.test(norm);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawQuery = input.value.trim();
      if (!rawQuery) { input.focus(); return; }

      // Route to the best-matching product page
      const matched = PRODUCT_ROUTES.find(r => r.pattern.test(rawQuery));
      const target  = matched ? matched.page : 'products.html';
      const current = window.location.pathname.split('/').pop() || 'index.html';

      const isCategory = isCategoryOnly(rawQuery);

      // If already on that target page
      if (current === target) {
        const catalogInput = document.querySelector('.catalog-search-input, #catalogSearchInput');
        const productGrid  = document.querySelector('.product-grid');
        if (catalogInput && productGrid) {
          if (isCategory) {
            catalogInput.value = '';
            catalogInput.dispatchEvent(new Event('input'));
          } else {
            catalogInput.value = rawQuery;
            catalogInput.dispatchEvent(new Event('input'));
          }
          productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }

      // If broad category search -> open clean category page with all products
      if (isCategory) {
        window.location.href = target;
      } else {
        // Specific product code or item search -> pass ?q=
        window.location.href = `${target}?q=${encodeURIComponent(rawQuery)}`;
      }
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

    const isCategoryOnly = (q) => {
      const norm = q.toLowerCase().replace(/[-_]/g, ' ').trim();
      const catRegex = /^(hand\s*railing|handrail|railing|rail|hand|balustrade|glass\s*railing|hr|kitchen\s*and\s*wardrobe|kitchen\s*&?\s*wardrobe|kitchen|wardrobe|profiles?|cabinet|drawer|cupboard|kw|office\s*partition|office|partition|acoustic|cubicle|op|upvc\s*window|upvc|u\s*pvc|pvc|aluminum\s*window|aluminium\s*window|aluminum|aluminium|alu|alum|al\s*window|al|rubber\s*gasket|gasket|rubber|all|products?)$/i;
      return catRegex.test(norm);
    };

    // Pre-compute search data per card
    const cardData = productCards.map(card => {
      const title    = (card.querySelector('.item-title, h3')?.textContent || '').replace(/\s+/g, ' ').trim();
      const code     = (card.querySelector('.item-code-badge')?.textContent || '').replace(/\s+/g, ' ').trim();
      const specs    = (card.querySelector('.item-specs-grid')?.textContent || '').replace(/\s+/g, ' ').trim();
      const dsearch  = (card.getAttribute('data-search') || '').trim();
      const imgAlt   = (card.querySelector('img')?.getAttribute('alt') || '').trim();
      const fullText = (card.textContent || '').replace(/\s+/g, ' ').trim();

      // Variations: SS-178 -> ss178 and 178; MP-1607 -> mp1607 and 1607
      const codeNoHyphen = code.replace(/-/g, '');
      const codeNumbers  = code.replace(/[^0-9]/g, '');

      const combined = `${title} ${code} ${codeNoHyphen} ${codeNumbers} ${specs} ${dsearch} ${imgAlt} ${fullText}`.toLowerCase();

      return { el: card, text: combined, code: code.toLowerCase(), title: title.toLowerCase() };
    });

    function performSearch(query) {
      const raw = query.toLowerCase().trim();
      const q = raw.replace(/\s+/g, ' ');
      const qNoHyphen = q.replace(/-/g, '');
      const qNumbers  = q.replace(/[^0-9]/g, '');

      // Check if search query is a general category term
      const isGeneralCategory = isCategoryOnly(raw);

      const terms = q.split(' ').filter(Boolean);
      let visibleCount = 0;

      cardData.forEach(({ el, text, code, title }) => {
        let matches = false;

        if (!raw || isGeneralCategory) {
          matches = true;
        } else {
          matches = terms.every(t => text.includes(t)) ||
                    (qNoHyphen.length > 1 && text.includes(qNoHyphen)) ||
                    (qNumbers.length >= 2 && text.includes(qNumbers));
        }

        el.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
      });

      resultsCountEls.forEach(el => {
        el.textContent = el.id === 'resultsCountNum'
          ? visibleCount
          : `${visibleCount} Product${visibleCount === 1 ? '' : 's'} Found`;
      });

      if (clearBtn) clearBtn.hidden = (raw.length === 0);

      if (noResultsMsg) {
        const show = visibleCount === 0 && raw.length > 0;
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

    // Read ?q= from URL and auto-search (only if it's a specific product code/item, not a category name)
    const qParam = new URLSearchParams(window.location.search).get('q') || new URLSearchParams(window.location.search).get('search');
    if (qParam && !isCategoryOnly(qParam)) {
      searchInputs.forEach(i => i.value = qParam);
      performSearch(qParam);
      if (productGrid) {
        setTimeout(() => productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
      }
    } else {
      searchInputs.forEach(i => i.value = '');
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

  // --- K. Quote Modal & WhatsApp Product Inquiries ---
  function initQuoteModal() {
    function closeModal() {
      const modal = document.getElementById('quoteModal');
      if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
    }

    document.addEventListener('click', (e) => {
      // 1. Open Quote Modal on "Get Quote" button
      const quoteBtn = e.target.closest('.btn-quote');
      if (quoteBtn) {
        e.preventDefault();
        const modal = document.getElementById('quoteModal');
        if (!modal) return;

        const productInput = document.getElementById('quoteProduct');
        if (productInput) {
          const customProduct = quoteBtn.getAttribute('data-product');
          if (customProduct) {
            productInput.value = customProduct;
          } else {
            const card  = quoteBtn.closest('.product-item-card, .product-card');
            const title = (card?.querySelector('.item-title, h3')?.textContent || '').replace(/\s+/g, ' ').trim();
            const code  = (card?.querySelector('.item-code-badge')?.textContent || '').replace(/\s+/g, ' ').trim();
            productInput.value = title + (code ? ` (${code})` : '');
          }
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
      }

      // 2. Direct WhatsApp Click from Product Card
      const waBtn = e.target.closest('.btn-whatsapp, a[href*="wa.me"]');
      if (waBtn) {
        const card = waBtn.closest('.product-item-card, .product-card');
        if (card) {
          e.preventDefault();
          const title = (card.querySelector('.item-title, h3')?.textContent || '').replace(/\s+/g, ' ').trim();
          const code  = (card.querySelector('.item-code-badge')?.textContent || '').replace(/\s+/g, ' ').trim();
          const productLabel = title + (code ? ` (Code: ${code})` : '');
          const msg = encodeURIComponent(
            `Hello Madhav Polymers, I am interested in *${productLabel}*.\nPlease share the price quotation, MOQ, and technical catalog.`
          );
          window.open(`https://wa.me/919355761001?text=${msg}`, '_blank');
          return;
        }
      }

      // 3. Close modal
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
