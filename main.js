/* ========================================================
   Madhav Polymers — Root main.js Wrapper
   Delegates to js/main.js as single source of truth.
   ======================================================== */
(function() {
  if (!window.mpMainLoaded) {
    const script = document.createElement('script');
    script.src = 'js/main.js';
    document.head.appendChild(script);
  }
})();
