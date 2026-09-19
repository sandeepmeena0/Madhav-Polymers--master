/* ========================================================
   Madhav Polymers — Header / Footer loader
   Include this on every page:
     <div id="header-placeholder"></div>
     ...page content...
     <div id="footer-placeholder"></div>
     <script src="js/include.js"></script>
   ======================================================== */

(function () {
  // Synchronous cache injection for instant 0ms header render on page transition
  const cachedHeader = sessionStorage.getItem('mp_header_cached');
  const hpSync = document.getElementById('header-placeholder');
  if (hpSync && !hpSync.querySelector('header') && cachedHeader) {
    hpSync.innerHTML = cachedHeader;
    setActiveNavItem();
  }

  async function loadInto(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    // If element already contains pre-rendered markup, don't re-fetch
    if (el.querySelector('header') || el.querySelector('footer')) {
      return;
    }
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      const text = await res.text();
      el.innerHTML = text;
      if (id === 'header-placeholder') {
        sessionStorage.setItem('mp_header_cached', text);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function setActiveNavItem() {
    let current = window.location.pathname.split('/').pop();
    if (!current) current = 'index.html';

    document.querySelectorAll('.main-nav li[data-page]').forEach((li) => {
      li.classList.toggle('active', li.getAttribute('data-page') === current);
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
      if (window.innerWidth <= 680) {
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
        // If it's a dropdown toggle on mobile, don't close the drawer
        if (window.innerWidth <= 680 && link.parentElement.classList.contains('has-dropdown')) {
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
        if (window.innerWidth <= 680) {
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



  function handleFormSubmit(event) {
    event.preventDefault();

    // 1. Enter target WhatsApp number (with Country Code, without + sign)
    const whatsappNumber = "919876543210"; // REPLACE WITH YOUR PHONE NUMBER

    // 2. Fetch input field values
    const name = document.getElementById('mpName').value.trim();
    const email = document.getElementById('mpEmail').value.trim();
    const phone = document.getElementById('mpPhone').value.trim() || 'Not provided';
    const details = document.getElementById('mpDetails').value.trim();

    // 3. Format the message for WhatsApp
    const whatsappMessage = `*New Project Inquiry*%0A%0A` +
      `*Name:* ${encodeURIComponent(name)}%0A` +
      `*Email:* ${encodeURIComponent(email)}%0A` +
      `*Phone:* ${encodeURIComponent(phone)}%0A` +
      `*Project Details:* ${encodeURIComponent(details)}`;

    // 4. Reveal success message bar
    const successAlert = document.getElementById('mpSuccessAlert');
    successAlert.style.display = 'block';

    // 5. Open WhatsApp chat in a new browser tab
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    setTimeout(() => {
      window.open(whatsappURL, '_blank');
    }, 400);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const section = document.getElementById("mpAboutSection");

    // IntersectionObserver triggers animation when 20% of section enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("mp-active");
            observer.unobserve(entry.target); // Triggers animation once
          }
        });
      },
      { threshold: 0.2 }
    );

    if (section) {
      observer.observe(section);
    }
  });

   document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero-slider .slide");
  const prevBtn = document.querySelector(".hero-slider .prev-btn");
  const nextBtn = document.querySelector(".hero-slider .next-btn");

  if (!slides.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const slideInterval = 6000; // 6 seconds per slide
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

  // Button Listeners
  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetTimer();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetTimer();
  });

  // Start autoplay
  startTimer();
});