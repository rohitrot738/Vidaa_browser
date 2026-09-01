(function () {
  'use strict';

  var KEY = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,
    BACK: 8,
    ESC: 27
  };

  function focusables() {
    return Array.prototype.slice.call(document.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) {
      var r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
  }

  function center(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function move(direction) {
    var items = focusables();
    if (!items.length) return;
    var current = document.activeElement;
    if (items.indexOf(current) < 0) {
      items[0].focus();
      return;
    }

    var from = center(current);
    var best = null;
    var bestScore = Infinity;

    items.forEach(function (el) {
      if (el === current) return;
      var to = center(el);
      var dx = to.x - from.x;
      var dy = to.y - from.y;
      var valid =
        (direction === 'left' && dx < -2) ||
        (direction === 'right' && dx > 2) ||
        (direction === 'up' && dy < -2) ||
        (direction === 'down' && dy > 2);
      if (!valid) return;

      var primary = (direction === 'left' || direction === 'right') ? Math.abs(dx) : Math.abs(dy);
      var cross = (direction === 'left' || direction === 'right') ? Math.abs(dy) : Math.abs(dx);
      var score = primary + cross * 2.2;
      if (score < bestScore) {
        bestScore = score;
        best = el;
      }
    });

    if (best) best.focus();
  }

  document.addEventListener('keydown', function (e) {
    var code = e.keyCode || e.which;
    var active = document.activeElement;
    var typing = active && active.tagName === 'INPUT';

    if (code === KEY.LEFT && !typing) { e.preventDefault(); move('left'); }
    else if (code === KEY.RIGHT && !typing) { e.preventDefault(); move('right'); }
    else if (code === KEY.UP && !typing) { e.preventDefault(); move('up'); }
    else if (code === KEY.DOWN && !typing) { e.preventDefault(); move('down'); }
    else if ((code === KEY.BACK || code === KEY.ESC) && window.BrowserCore && BrowserCore.canGoBack()) {
      e.preventDefault();
      var url = BrowserCore.back();
      if (window.VIDAA_UI && url) window.VIDAA_UI.openWithoutHistory(url);
    }
  }, false);

  window.VIDAA_REMOTE_KEYS = KEY;
})();
