(function () {
  var KEY = 'telcb2-progress';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (e) {}
  }
  function currentPct() {
    var el = document.documentElement;
    var max = el.scrollHeight - el.clientHeight;
    if (max <= 0) return 100;
    return Math.min(100, Math.round((window.scrollY / max) * 100));
  }

  var day = document.body.getAttribute('data-day');
  if (day) {
    var bar = document.getElementById('read-bar');
    var label = document.getElementById('read-pct');
    var data = load();
    var best = Number(data[day]) || 0;

    function tick() {
      var n = currentPct();
      if (bar) bar.style.width = n + '%';
      if (label) label.textContent = n + '%';
      if (n > best) {
        best = n;
        data[day] = best;
        save(data);
      }
    }

    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    tick();
    return;
  }

  var data = load();
  var links = document.querySelectorAll('a.day[data-day]');
  var done = 0;
  var total = links.length;
  links.forEach(function (link) {
    var n = Number(data[link.getAttribute('data-day')]) || 0;
    var fill = link.querySelector('.day-fill');
    var status = link.querySelector('[data-status]');
    if (fill) fill.style.width = n + '%';
    if (status) {
      if (n >= 95) {
        status.textContent = 'Done';
        done += 1;
      } else if (n > 0) {
        status.textContent = n + '%';
      }
    }
  });
  var course = document.getElementById('course-prog');
  if (course) {
    course.textContent = done === total && total > 0
      ? 'All ' + total + ' days read.'
      : done + ' of ' + total + ' days finished · progress is saved on this phone.';
  }
})();
