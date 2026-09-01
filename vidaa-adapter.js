(function (global) {
  'use strict';

  var lastWindow = null;

  function openInPlatformEngine(url) {
    if (!url) return false;

    /*
     * VIDAA web apps already execute inside the TV web engine. Opening a new
     * top-level window lets the platform engine render arbitrary sites without
     * iframe X-Frame-Options/CSP restrictions. On many VIDAA builds this opens
     * a full-screen chromeless browsing window; Back returns to the app shell.
     */
    try {
      lastWindow = global.open(url, '_blank');
      if (lastWindow) return true;
    } catch (e) {}

    /* Older engines can block popups. Same-window navigation is the fallback. */
    try {
      global.location.href = url;
      return true;
    } catch (e2) {
      return false;
    }
  }

  function closeChild() {
    try {
      if (lastWindow && !lastWindow.closed) {
        lastWindow.close();
        lastWindow = null;
        return true;
      }
    } catch (e) {}
    return false;
  }

  global.VIDAA_BROWSER_ADAPTER = {
    name: 'VIDAA Platform Web Engine',
    type: 'platform-window',
    open: openInPlatformEngine,
    closeCurrent: closeChild,
    supportsArbitrarySites: true
  };
})(window);
