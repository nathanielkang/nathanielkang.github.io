(function () {
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.atmosphere-carousel').forEach(function (carousel) {
    var slides = Array.from(carousel.querySelectorAll('.atmosphere-carousel__slide'));
    if (!slides.length) return;
    var controls = carousel.querySelector('.atmosphere-carousel__controls');
    var count = carousel.querySelector('.atmosphere-carousel__count');
    var status = carousel.querySelector('.atmosphere-carousel__status');
    var pause = carousel.querySelector('[data-carousel="pause"]');
    var interval = parseInt(carousel.getAttribute('data-interval'), 10) || 3000;
    var current = 0;
    var timer = null;
    var paused = motion.matches;
    var focused = false;

    slides.forEach(function (slide, i) {
      slide.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    });

    function syncTimer() {
      clearInterval(timer);
      timer = null;
      if (!paused && !focused && !document.hidden) {
        timer = setInterval(function () { goTo(current + 1, false); }, interval);
      }
      if (pause) {
        pause.textContent = paused ? 'Play' : 'Pause';
        pause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
        pause.setAttribute('aria-pressed', paused ? 'true' : 'false');
      }
    }

    function goTo(index, manual) {
      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      slides[current].setAttribute('aria-hidden', 'false');
      if (count) count.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      if (manual && status) status.textContent = slides[current].getAttribute('aria-label');
      // Fetch the next photograph before the next transition, including lazy images.
      var next = slides[(current + 1) % slides.length].querySelector('.atmosphere-carousel__photo');
      if (next) next.loading = 'eager';
    }

    if (controls) {
      controls.hidden = false;
      controls.addEventListener('click', function (event) {
        var button = event.target.closest('[data-carousel]');
        if (!button) return;
        var action = button.getAttribute('data-carousel');
        if (action === 'pause') paused = !paused;
        else goTo(current + (action === 'previous' ? -1 : 1), true);
        syncTimer();
      });
      controls.addEventListener('focusin', function () { focused = true; syncTimer(); });
      controls.addEventListener('focusout', function (event) {
        if (!controls.contains(event.relatedTarget)) { focused = false; syncTimer(); }
      });
      controls.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        goTo(current + (event.key === 'ArrowLeft' ? -1 : 1), true);
        syncTimer();
      });
    }
    document.addEventListener('visibilitychange', syncTimer);
    motion.addEventListener('change', function (event) {
      paused = event.matches;
      if (event.matches) goTo(0, false);
      syncTimer();
    });
    goTo(0, false);
    syncTimer();
  });
})();
