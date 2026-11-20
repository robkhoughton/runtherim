/* Race Day: show one distance at a time.
   Elements with data-dist="50k 35k ..." are shown only when the chosen distance is in their list;
   "all" is the full schedule. The choice comes from ?race=35k (for links in runner emails),
   else from the last choice on this device, else "all". Without JS, CSS shows the full schedule. */
(function () {
  var KEY = 'rtr-race';
  var valid = ['50k', '35k', '21k', '10k', '5k', 'all'];
  var buttons = document.querySelectorAll('[data-pick]');
  var parts = document.querySelectorAll('[data-dist]');
  if (!buttons.length) return;

  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  function show(d) {
    for (var i = 0; i < parts.length; i++) {
      var on = parts[i].getAttribute('data-dist').split(' ').indexOf(d) !== -1;
      parts[i].hidden = !on;
    }
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].setAttribute('aria-pressed', buttons[j].getAttribute('data-pick') === d ? 'true' : 'false');
    }
  }

  function choose(d) {
    show(d); store(d);
    var url = new URL(window.location.href);
    if (d === 'all') url.searchParams.delete('race'); else url.searchParams.set('race', d);
    history.replaceState(null, '', url);
  }

  for (var k = 0; k < buttons.length; k++) {
    buttons[k].addEventListener('click', function () { choose(this.getAttribute('data-pick')); });
  }

  var q = (new URLSearchParams(window.location.search).get('race') || '').toLowerCase();
  var start = valid.indexOf(q) !== -1 ? q : (valid.indexOf(stored()) !== -1 ? stored() : 'all');
  if (q && valid.indexOf(q) !== -1) store(q);
  show(start);
})();
