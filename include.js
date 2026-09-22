/* ========================================================
   Madhav Polymers — Include JS Wrapper
   This file ensures backward compatibility and delegates to js/main.js.
   ======================================================== */
(function() {
  if (!window.mpMainLoaded) {
    const script = document.createElement('script');
    script.src = 'js/main.js';
    document.head.appendChild(script);
  }
})();