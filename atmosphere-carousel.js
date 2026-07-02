(function () {
  var carousels = document.querySelectorAll('.atmosphere-carousel');
  if (!carousels.length) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INTERVAL = 5500;

  carousels.forEach(function (carousel) {
    var slides = carousel.querySelectorAll('.atmosphere-carousel__slide');
    if (!slides.length) return;

    var current = 0;
    var timer = null;

    slides.forEach(function (slide, i) {
      var img = slide.querySelector('img');
      slide.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
      if (i > 0 && img) img.loading = 'lazy';
    });

    function goTo(index) {
      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      slides[current].setAttribute('aria-hidden', 'false');
    }

    function next() {
      goTo(current + 1);
    }

    function startAutoplay() {
      if (timer) clearInterval(timer);
      if (!reducedMotion) {
        timer = setInterval(next, INTERVAL);
      }
    }

    startAutoplay();
  });
})();
