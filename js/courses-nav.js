/* Distance pages (50k.html … 5k.html): the sticky distance bar (Rob, 2026-11-21; one page per
   distance since 2026-11-25). Each chip links to a distance page; the current one is marked
   aria-current="true" in the markup. This script:
   - keeps the bar just under the sticky site header (--header-h);
   - on phones, scrolls the bar sideways so the current distance's chip is in view;
   - fades the bar's right edge while more chips lie off-screen, so the row reads as scrollable.
   Without JavaScript the bar still works as plain links. */
(function () {
  var bar = document.getElementById('course-nav');
  var header = document.querySelector('.site-header');
  if (!bar || !header) return;
  var root = document.documentElement;
  var list = bar.querySelector('ul');

  function measure() {
    // Measure with the mobile menu closed, so an open menu doesn't push the bar down for good.
    var nav = document.getElementById('site-nav');
    var wasOpen = nav && nav.classList.contains('open');
    if (wasOpen) nav.classList.remove('open');
    root.style.setProperty('--header-h', header.offsetHeight + 'px');
    if (wasOpen) nav.classList.add('open');
  }
  function edge() {
    list.classList.toggle('more', list.scrollLeft + list.clientWidth < list.scrollWidth - 4);
  }
  function showCurrent() {
    var a = bar.querySelector('a[aria-current="true"]');
    if (!a) return;
    var li = a.parentNode, left = li.offsetLeft - list.offsetLeft;
    // Sideways only: scrollIntoView would also move the page.
    if (left < list.scrollLeft || left + li.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollLeft = left - 8;
  }
  list.addEventListener('scroll', edge, { passive: true });

  measure();
  showCurrent();
  edge();
  window.addEventListener('resize', function () { measure(); edge(); });
  window.addEventListener('load', function () { measure(); showCurrent(); edge(); });
})();
