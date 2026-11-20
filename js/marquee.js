/* Pause/Play for the Home sponsor strip. Hover and keyboard focus also pause it (CSS). */
(function () {
  var strips = document.querySelectorAll('[data-marquee]');
  for (var i = 0; i < strips.length; i++) {
    (function (m) {
      var b = m.querySelector('.marquee-toggle');
      if (!b) return;
      b.addEventListener('click', function () {
        var paused = m.classList.toggle('paused');
        b.setAttribute('aria-pressed', paused ? 'true' : 'false');
        b.textContent = paused ? 'Play' : 'Pause';
      });
    })(strips[i]);
  }
})();
