/* Trailforks route widgets on courses.html (same embed the 2026 WordPress page used).
   Trailforks' widget.js turns each .TrailforksWidgetRoute div into an iframe (map, elevation,
   trails, details). It is loaded only when a widget first nears the viewport, so the five
   maps don't slow the first view of the page. */
(function () {
  var widgets = document.querySelectorAll('.TrailforksWidgetRoute');
  if (!widgets.length) return;
  var loaded = false;
  function load() {
    if (loaded) return; loaded = true;
    var r = document.createElement('script');
    r.src = 'https://es.pinkbike.org/326/sprt/j/trailforks/iframeResizer.min.js';
    r.onload = function () {
      var w = document.createElement('script');
      w.src = 'https://es.pinkbike.org/ttl-86400/sprt/j/trailforks/widget.js';
      document.head.appendChild(w);
    };
    document.head.appendChild(r);
  }
  if (!('IntersectionObserver' in window)) { load(); return; }
  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) if (entries[i].isIntersecting) { io.disconnect(); load(); return; }
  }, { rootMargin: '600px 0px' });
  for (var j = 0; j < widgets.length; j++) io.observe(widgets[j]);
})();
