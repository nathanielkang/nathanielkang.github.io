(function () {
  var carousels = document.querySelectorAll('.atmosphere-carousel');
  if (!carousels.length) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INTERVAL = 7000;

  carousels.forEach(function (carousel) {
    var slides = carousel.querySelectorAll('.atmosphere-carousel__slide');
    var dotsContainer = carousel.querySelector('.atmosphere-carousel__dots');
    if (!slides.length || !dotsContainer) return;

    var current = 0;
    var timer = null;
    var paused = false;

    slides.forEach(function (slide, i) {
      var img = slide.querySelector('img');
      var label = (img && img.alt) ? img.alt : ('Slide ' + (i + 1));
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'atmosphere-carousel__dot' + (i === 0 ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', label);
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', function () {
        goTo(i);
        resetTimer();
      });
      dotsContainer.appendChild(btn);
      slide.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
      if (i > 0 && img) img.loading = 'lazy';
    });

    var dots = dotsContainer.querySelectorAll('.atmosphere-carousel__dot');

    function goTo(index) {
      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      dots[current].classList.remove('is-active');
      dots[current].setAttribute('aria-selected', 'false');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      slides[current].setAttribute('aria-hidden', 'false');
      dots[current].classList.add('is-active');
      dots[current].setAttribute('aria-selected', 'true');
    }

    function next() {
      goTo(current + 1);
    }

    function resetTimer() {
      if (timer) clearInterval(timer);
      timer = null;
      if (!reducedMotion && !paused) {
        timer = setInterval(next, INTERVAL);
      }
    }

    carousel.addEventListener('mouseenter', function () {
      paused = true;
      if (timer) clearInterval(timer);
    });
    carousel.addEventListener('mouseleave', function () {
      paused = false;
      resetTimer();
    });
    carousel.addEventListener('focusin', function () {
      paused = true;
      if (timer) clearInterval(timer);
    });
    carousel.addEventListener('focusout', function (e) {
      if (!carousel.contains(e.relatedTarget)) {
        paused = false;
        resetTimer();
      }
    });

    resetTimer();
  });
})();
