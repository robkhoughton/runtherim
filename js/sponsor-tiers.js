/* Sponsors page: turns each tier's logo list into a looping carousel.
   The original list stays the only copy screen readers and keyboards see; the filler copies that make
   the loop seamless are aria-hidden and untabbable. Copies are added until the row is wider than the
   viewport, so short tiers (Gold, Bronze) loop without a gap. Tiers may sit in several sections;
   one Pause button (.tiers-toggle) stops them all. Every tier moves at the same speed in
   px/s regardless of card size. Without JS, or with reduced motion, the static tier grids remain. */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SPEED = 28; // px per second
  var tiers = [];
  var lists = document.querySelectorAll('[data-sponsor-tiers] .sponsor-tier .sponsor-grid');
  if (!lists.length) return;
  for (var i = 0; i < lists.length; i++) {
    var list = lists[i];
    var viewport = document.createElement('div');
    viewport.className = 'tier-viewport';
    var track = document.createElement('div');
    track.className = 'tier-track';
    list.parentNode.insertBefore(viewport, list);
    viewport.appendChild(track);
    track.appendChild(list);
    list.closest('.sponsor-tier').classList.add('is-carousel');
    tiers.push({ viewport: viewport, track: track, list: list });
  }

  function copyOf(list) {
    var c = list.cloneNode(true);
    c.removeAttribute('aria-labelledby');
    c.setAttribute('aria-hidden', 'true');
    var links = c.querySelectorAll('a');
    for (var j = 0; j < links.length; j++) links[j].setAttribute('tabindex', '-1');
    var imgs = c.querySelectorAll('img');
    for (var k = 0; k < imgs.length; k++) imgs[k].setAttribute('alt', '');
    return c;
  }

  function layout() {
    for (var i = 0; i < tiers.length; i++) {
      var t = tiers[i];
      while (t.track.lastChild !== t.list) t.track.removeChild(t.track.lastChild);
      var setWidth = t.list.getBoundingClientRect().width;
      if (!setWidth) continue;
      var copies = Math.ceil(t.viewport.clientWidth / setWidth) + 1;
      for (var n = 1; n < copies; n++) t.track.appendChild(copyOf(t.list));
      t.track.style.setProperty('--shift', setWidth + 'px');
      t.track.style.animationDuration = (setWidth / SPEED) + 's';
    }
  }

  var timer;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(layout, 150);
  });
  window.addEventListener('load', layout);
  layout();

  var toggle = document.querySelector('.tiers-toggle');
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', function () {
      var paused = document.documentElement.classList.toggle('tiers-paused');
      toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
      toggle.textContent = paused ? 'Play' : 'Pause';
    });
  }
})();
