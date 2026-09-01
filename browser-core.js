(function (global) {
  'use strict';

  function normalize(input) {
    var value = String(input || '').trim();
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    if (/^www\./i.test(value) || /^[^\s]+\.[a-z]{2,}(\/.*)?$/i.test(value)) {
      return 'https://' + value;
    }
    return 'https://www.google.com/search?q=' + encodeURIComponent(value);
  }

  function hostname(url) {
    try { return new URL(url).hostname.replace(/^www\./, '') || 'New Tab'; }
    catch (e) { return 'New Tab'; }
  }

  var history = [];
  var index = -1;

  var BrowserCore = {
    mode: 'vidaa-webapp',
    normalize: normalize,
    hostname: hostname,

    push: function (url) {
      history = history.slice(0, index + 1);
      history.push(url);
      index = history.length - 1;
      return url;
    },

    back: function () {
      if (index <= 0) return null;
      index -= 1;
      return history[index];
    },

    forward: function () {
      if (index >= history.length - 1) return null;
      index += 1;
      return history[index];
    },

    current: function () {
      return index >= 0 ? history[index] : '';
    },

    canGoBack: function () { return index > 0; },
    canGoForward: function () { return index >= 0 && index < history.length - 1; },

    /*
     * Native browsing hook.
     * The public VIDAA web-app layer is HTML5-based. If the VIDAA DevKit/partner
     * environment exposes a privileged browser/webview API, its adapter belongs
     * here. Until then, the UI can use the embedded web-engine fallback.
     */
    getNativeAdapter: function () {
      if (global.VIDAA_BROWSER_ADAPTER && typeof global.VIDAA_BROWSER_ADAPTER.open === 'function') {
        return global.VIDAA_BROWSER_ADAPTER;
      }
      return null;
    }
  };

  global.BrowserCore = BrowserCore;
})(window);
