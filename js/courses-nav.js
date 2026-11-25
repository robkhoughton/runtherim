/* Courses page: sticky distance bar (Rob, 2026-11-21).
   - Keeps the bar just under the sticky site header (--header-h) and makes anchor jumps land
     below both (--course-nav-h).
   - Highlights the course on screen (aria-current="true") and keeps that chip visible in the
     sideways-scrolling bar on phones. Without JavaScript the bar still works as plain links. */
(function () {
  var bar = document.getElementById('course-nav');
  var header = document.querySelector('.site-header');
  if (!bar || !header) return;
  var root = document.documentElement;
  var list = bar.querySelector('ul');
  var links = Array.prototype.slice.call(bar.querySelectorAll('a[href^="#"]'));

  function measure() {
    // Measure with the mobile menu closed, so an open menu doesn't push the bar down for good.
    var nav = document.getElementById('site-nav');
    var wasOpen = nav && nav.classList.contains('open');
    if (wasOpen) nav.classList.remove('open');
    root.style.setProperty('--header-h', header.offsetHeight + 'px');
    root.style.setProperty('--course-nav-h', bar.offsetHeight + 'px');
    if (wasOpen) nav.classList.add('open');
  }
  // Fade the bar's right edge while more chips lie off-screen (phones), so the row reads as scrollable.
  function edge() {
    list.classList.toggle('more', list.scrollLeft + list.clientWidth < list.scrollWidth - 4);
  }
  list.addEventListener('scroll', edge, { passive: true });

  measure();
  edge();
  window.addEventListener('resize', function () { measure(); edge(); });
  window.addEventListener('load', function () { measure(); edge(); });

  var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var current = null;

  function setCurrent(id) {
    if (id === current) return;
    current = id;
    links.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) {
        a.setAttribute('aria-current', 'true');
        // Scroll the bar sideways only (scrollIntoView would also move the page).
        var li = a.parentNode;
        var left = li.offsetLeft - list.offsetLeft;
        if (left < list.scrollLeft || left + li.offsetWidth > list.scrollLeft + list.clientWidth) {
          list.scrollLeft = left - 8;
        }
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  // The current course is the last one whose top has passed the bottom of the bar.
  function update() {
    var line = header.offsetHeight + bar.offsetHeight + 16;
    var id = null;
    sections.forEach(function (s) {
      if (s && s.getBoundingClientRect().top <= line) id = s.id;
    });
    // Above the first course, or below the last one's end (the "Ready to run?" band): no highlight.
    var last = sections[sections.length - 1];
    if (last && last.getBoundingClientRect().bottom < line) id = null;
    if (id === null) {
      current = null;
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
    } else {
      setCurrent(id);
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; update(); });
  }, { passive: true });
  update();
})();
