/* ========================================================
   Madhav Polymers — Central JavaScript (js/main.js)
   All site functionality is driven from this single file.
   ======================================================== */
window.mpMainLoaded = true;

// --- 1. WhatsApp Inquiry Form Submission ---
function handleFormSubmit(event) {
  event.preventDefault();
  const whatsappNumber = "919355761001"; // Target WhatsApp Number

  const nameEl = document.getElementById('mpName');
  const emailEl = document.getElementById('mpEmail');
  const phoneEl = document.getElementById('mpPhone');
  const detailsEl = document.getElementById('mpDetails');

  const name = nameEl ? nameEl.value.trim() : '';
  const email = emailEl ? emailEl.value.trim() : '';
  const phone = (phoneEl && phoneEl.value.trim()) ? phoneEl.value.trim() : 'Not provided';
  const details = detailsEl ? detailsEl.value.trim() : '';

  const whatsappMessage = `*New Project Inquiry*%0A%0A` +
    `*Name:* ${encodeURIComponent(name)}%0A` +
    `*Email:* ${encodeURIComponent(email)}%0A` +
    `*Phone:* ${encodeURIComponent(phone)}%0A` +
    `*Project Details:* ${encodeURIComponent(details)}`;

  const successAlert = document.getElementById('mpSuccessAlert');
  if (successAlert) {
    successAlert.style.display = 'block';
  }

  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  setTimeout(() => {
    window.open(whatsappURL, '_blank');
  }, 400);
}

// --- Main Initialization on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', async function () {

  // --- A. Header / Footer Partial Loader ---
  async function loadInto(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.querySelector('header') || el.querySelector('footer')) return;
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
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
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

    nav.querySelectorAll('a').forEach((link) => {
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

  function initHeaderSearch() {
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

    form.onsubmit = (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (!query) {
        input.focus();
        return;
      }
      window.location.href = `products.html?q=${encodeURIComponent(query)}`;
    };
  }

  // Load Header and Footer Partials
  await Promise.all([
    loadInto('header-placeholder', 'header.html'),
    loadInto('footer-placeholder', 'footer.html'),
  ]);

  setActiveNavItem();
  initHeaderScroll();
  initMobileMenu();
  initHeaderSearch();
  document.dispatchEvent(new CustomEvent('partialsLoaded'));


  // --- B. Catalog Live Search & Filter ---
  const searchInputs = document.querySelectorAll('.catalog-search-input, #catalogSearchInput');
  const productCards = Array.from(document.querySelectorAll('.product-item-card, .product-card'));
  const resultsCountEls = document.querySelectorAll('.results-count, #resultsCount, #resultsCountNum');
  const noResultsMsg = document.getElementById('noResultsMsg');
  const noResultsTerm = document.getElementById('noResultsTerm');
  const clearBtn = document.getElementById('catalogSearchClear');

  function performSearch(query) {
    const q = query.toLowerCase().trim();
    const terms = q.split(/\s+/).filter(Boolean);
    let visibleCount = 0;

    productCards.forEach(card => {
      const title = card.querySelector('.item-title, h3')?.textContent.toLowerCase() || '';
      const code = card.querySelector('.item-code-badge')?.textContent.toLowerCase() || '';
      const specs = card.querySelector('.item-specs-grid')?.textContent.toLowerCase() || '';
      const dataSearch = (card.getAttribute('data-search') || '').toLowerCase();
      const imgAlt = card.querySelector('img')?.getAttribute('alt')?.toLowerCase() || '';
      const fullText = (card.textContent || '').toLowerCase();

      const combinedHaystack = `${title} ${code} ${specs} ${dataSearch} ${imgAlt} ${fullText}`;

      let matches = true;
      if (terms.length > 0) {
        matches = terms.every(t => combinedHaystack.includes(t));
      }

      if (matches) {
        card.style.display = '';
        card.removeAttribute('hidden');
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.setAttribute('hidden', 'true');
      }
    });

    // Update Result Count elements
    resultsCountEls.forEach(el => {
      if (el.id === 'resultsCountNum') {
        el.textContent = visibleCount;
      } else {
        el.textContent = `${visibleCount} Product${visibleCount === 1 ? '' : 's'} Found`;
      }
    });

    // Toggle Clear Button
    if (clearBtn) {
      clearBtn.hidden = (q.length === 0);
    }

    // Toggle No Results Message
    if (noResultsMsg) {
      if (visibleCount === 0 && q.length > 0) {
        if (noResultsTerm) noResultsTerm.textContent = query.trim();
        noResultsMsg.style.display = 'block';
        noResultsMsg.hidden = false;
      } else {
        noResultsMsg.style.display = 'none';
        noResultsMsg.hidden = true;
      }
    }
  }

  searchInputs.forEach(searchInput => {
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.preventDefault();
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInputs.forEach(i => i.value = '');
      performSearch('');
      if (searchInputs[0]) searchInputs[0].focus();
    });
  }

  // --- Handle URL query parameters (e.g. products.html?q=MP-1607) ---
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q') || urlParams.get('search');
  if (qParam && searchInputs.length > 0) {
    searchInputs.forEach(i => i.value = qParam);
    performSearch(qParam);
  }


  // --- C. Catalog Sort By ---
  const sortSelects = document.querySelectorAll('.catalog-sort-select, #catalogSortSelect');
  const productGrid = document.querySelector('.product-grid');

  if (sortSelects.length > 0 && productGrid) {
    const originalCards = Array.from(productCards);

    sortSelects.forEach(sortSelect => {
      sortSelect.addEventListener('change', function (e) {
        const sortValue = e.target.value;
        let sortedCards = Array.from(productCards);

        if (sortValue === 'name') {
          sortedCards.sort((a, b) => {
            const nameA = a.querySelector('.item-title, h3')?.textContent.trim().toLowerCase() || '';
            const nameB = b.querySelector('.item-title, h3')?.textContent.trim().toLowerCase() || '';
            return nameA.localeCompare(nameB);
          });
        } else if (sortValue === 'code') {
          sortedCards.sort((a, b) => {
            const codeA = a.querySelector('.item-code-badge')?.textContent.trim().toLowerCase() || '';
            const codeB = b.querySelector('.item-code-badge')?.textContent.trim().toLowerCase() || '';
            return codeA.localeCompare(codeB);
          });
        } else {
          // default (Smart) - random mix
          sortedCards = [...originalCards].sort(() => Math.random() - 0.5);
        }

        productGrid.innerHTML = '';
        sortedCards.forEach(card => {
          productGrid.appendChild(card);
        });
      });
    });
  }


  // --- D. Intersection Observer for About Section ---
  const aboutSection = document.getElementById("mpAboutSection");
  if (aboutSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aboutSection.classList.add("mp-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(aboutSection);
  }


  // --- E. Hero Slider ---
  const slides = document.querySelectorAll(".hero-slider .slide");
  const prevBtn = document.querySelector(".hero-slider .prev-btn");
  const nextBtn = document.querySelector(".hero-slider .next-btn");

  if (slides.length > 0 && prevBtn && nextBtn) {
    let currentIndex = 0;
    const slideInterval = 6000;
    let timer;

    function showSlide(index) {
      if (index >= slides.length) currentIndex = 0;
      else if (index < 0) currentIndex = slides.length - 1;
      else currentIndex = index;

      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentIndex);
      });
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    function startTimer() {
      timer = setInterval(nextSlide, slideInterval);
    }

    function resetTimer() {
      clearInterval(timer);
      startTimer();
    }

    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetTimer();
    });

    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetTimer();
    });

    startTimer();
  }

});
