/* Courses page: hover/tap readout for the elevation profiles (Joel's review, 2026-11-25).
   The profiles themselves are static markup generated from the GPX files by
   runtherim.com/_tools/elevation_profiles.py; this script only adds the crosshair readout:
   mile and elevation under the pointer, snapping to an aid station when one is close.
   Touch: tap or drag sideways (vertical swipes still scroll the page). Keyboard: focus the
   profile, then arrow keys step along the course and Home/End jump to the ends. */
(function () {
  var figs = document.querySelectorAll('figure.elev[data-elev]');
  for (var f = 0; f < figs.length; f++) setup(figs[f]);

  function setup(fig) {
    var data;
    try { data = JSON.parse(fig.getAttribute('data-elev')); } catch (e) { return; }
    var plot = fig.querySelector('.elev-plot');
    var mi = data.mi, ft = data.ft, aids = data.aid || [];
    var total = mi[mi.length - 1], yMin = data.y[0], yMax = data.y[1];
    var snap = total * 0.015; // smaller than the 2% keyboard step, so arrows can move off an aid station

    var cross = el('div', 'elev-cross'), dot = el('div', 'elev-dot'), tip = el('div', 'elev-tip');
    tip.setAttribute('role', 'status');
    [cross, dot, tip].forEach(function (n) { n.hidden = true; plot.appendChild(n); });
    var idx = -1;

    function nearest(m) {
      var lo = 0, hi = mi.length - 1;
      while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (mi[mid] < m) lo = mid; else hi = mid; }
      return (m - mi[lo] <= mi[hi] - m) ? lo : hi;
    }
    function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

    function show(m) {
      var aid = null;
      for (var a = 0; a < aids.length; a++) {
        if (Math.abs(aids[a][1] - m) <= snap && (!aid || Math.abs(aids[a][1] - m) < Math.abs(aid[1] - m))) aid = aids[a];
      }
      if (aid) m = aid[1];
      idx = nearest(m);
      var x = m / total * 100, y = (yMax - ft[idx]) / (yMax - yMin) * 100;
      cross.style.left = x + '%';
      dot.style.left = x + '%'; dot.style.top = y + '%';
      tip.innerHTML = 'Mile <strong>' + m.toFixed(1) + '</strong> · ' + fmt(ft[idx]) + ' ft' +
        (aid ? '<br>' + esc(aid[0]) + ' · ' + aid[2] + ' aid' : '');
      cross.hidden = dot.hidden = tip.hidden = false;
      // Keep the readout inside the plot's width.
      var w = plot.clientWidth, tw = tip.offsetWidth, left = x / 100 * w - tw / 2;
      tip.style.left = Math.max(-40, Math.min(left, w - tw + 6)) + 'px';
    }
    function hide() { cross.hidden = dot.hidden = tip.hidden = true; }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    function fromEvent(e) {
      var r = plot.getBoundingClientRect();
      var frac = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      show(frac * total);
    }
    plot.addEventListener('pointermove', fromEvent);
    plot.addEventListener('pointerdown', fromEvent);
    plot.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hide(); });
    document.addEventListener('pointerdown', function (e) { if (!plot.contains(e.target)) hide(); });
    plot.addEventListener('blur', hide);
    plot.addEventListener('keydown', function (e) {
      var step = total / 50, m = idx < 0 ? 0 : mi[idx];
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') m = Math.min(total, m + step);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') m = Math.max(0, m - step);
      else if (e.key === 'Home') m = 0;
      else if (e.key === 'End') m = total;
      else if (e.key === 'Escape') { hide(); return; }
      else return;
      e.preventDefault();
      show(m);
    });
  }

  function el(tag, cls) { var n = document.createElement(tag); n.className = cls; return n; }
})();
