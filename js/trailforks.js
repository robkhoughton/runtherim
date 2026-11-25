/* Trailforks route widgets on the distance pages (50k.html … 5k.html; same embed the 2026 WordPress page used).
   Trailforks' widget.js turns each .TrailforksWidgetRoute div into an iframe (map, elevation,
   trails, details). It is loaded only when a widget first nears the viewport, so the five
   maps don't slow the first view of the page.
   Phones (<= 760px): no map loads by itself (Joel, 2026-11-25). Each map gets a "Show map"
   button and a "View on Trailforks" link; a tap builds that one iframe directly, with the same
   widget URL widget.js would build, but map only (trails=0, details=0: the side panel left the
   map too narrow on a phone; Rob, 2026-11-25). widget.js is not used on phones, because re-running it for
   a second map would duplicate the maps already shown. The button then reads "Hide map" and
   closes the map again. */
(function () {
  var widgets = document.querySelectorAll('.TrailforksWidgetRoute');
  if (!widgets.length) return;

  if (window.matchMedia && window.matchMedia('(max-width: 760px)').matches) {
    for (var k = 0; k < widgets.length; k++) defer(widgets[k]);
    return;
  }

  function defer(div) {
    div.classList.remove('TrailforksWidgetRoute');
    div.classList.add('tf-deferred');
    var section = div.closest('section');
    var tfLink = section && section.querySelector('.course-links a[href*="trailforks.com/route"]');
    var row = document.createElement('div');
    row.className = 'tf-tap';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn';
    btn.textContent = 'Show map';
    row.appendChild(btn);
    if (tfLink) {
      var a = document.createElement('a');
      a.className = 'btn btn-light';
      a.href = tfLink.href;
      a.textContent = 'View on Trailforks';
      row.appendChild(a);
    }
    div.parentNode.insertBefore(row, div);
    div.id = div.id || 'tf-map-' + (section ? section.id : Math.random().toString(36).slice(2));
    btn.setAttribute('aria-controls', div.id);
    btn.setAttribute('aria-expanded', 'false');
    var iframe = null;
    // The button toggles: "Show map" builds the iframe on first use, "Hide map" closes it again so
    // swipes scroll the page. The iframe is kept while hidden, so reopening doesn't reload it.
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      if (open) {
        div.classList.remove('tf-loaded');
        div.classList.add('tf-deferred');
        btn.textContent = 'Show map';
        btn.setAttribute('aria-expanded', 'false');
        // Closing a tall map from below would leave the reader further down the page: bring the buttons back into view.
        if (row.getBoundingClientRect().top < 0) row.scrollIntoView({ block: 'center' });
        return;
      }
      if (!iframe) iframe = build();
      div.classList.remove('tf-deferred');
      div.classList.add('tf-loaded');
      btn.textContent = 'Hide map';
      btn.setAttribute('aria-expanded', 'true');
    });
    function build() {
      var h = '450px';
      var src = 'https://www.trailforks.com/widgets/route/?id=' + encodeURIComponent(div.getAttribute('data-id')) +
        '&w=100%25&h=' + h + '&activitytype=' + div.getAttribute('data-activitytype') +
        '&map=1&elevation=0&trails=0&details=0&s=0&units=imperial&basicmap=1&surface=null';
      var iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.width = '100%';
      iframe.height = '450';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('allowfullscreen', '1');
      var h1 = document.querySelector('h1');
      iframe.title = (h1 ? h1.textContent + ' ' : '') + 'route map from Trailforks';
      div.appendChild(iframe);
      return iframe;
    }
  }

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
