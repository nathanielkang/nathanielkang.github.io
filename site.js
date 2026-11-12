(function () {
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.querySelector('.mobile-panel');
  var desktop = window.matchMedia('(min-width: 900px)');
  var background = document.querySelectorAll('main, .site-footer');
  if (toggle && panel) {
    function closeMenu(restoreFocus) {
      panel.hidden = true;
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
      background.forEach(function (element) { element.inert = false; });
      if (restoreFocus) toggle.focus();
    }
    toggle.addEventListener('click', function () {
      if (!panel.hidden) { closeMenu(false); return; }
      panel.hidden = false;
      panel.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
      background.forEach(function (element) { element.inert = true; });
    });
    panel.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) closeMenu(true);
    });
    desktop.addEventListener('change', function (event) {
      if (event.matches) closeMenu(false);
    });
  }

  var dialog = document.querySelector('.figure-dialog');
  if (!dialog) return;
  var enlarged = dialog.querySelector('img');
  var caption = dialog.querySelector('.figure-dialog__caption');
  var close = dialog.querySelector('.figure-dialog__close');
  document.querySelectorAll('.figure-zoom, .prospect-figure__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var image = trigger.querySelector('img');
      if (!image) return;
      enlarged.src = image.currentSrc || image.src;
      enlarged.alt = image.alt;
      enlarged.style.setProperty('--figure-width', (image.naturalWidth || image.width) + 'px');
      var figure = trigger.closest('figure');
      var title = figure && figure.querySelector('.figure-caption__name');
      caption.textContent = title ? title.textContent : image.alt;
      if (typeof dialog.showModal === 'function') dialog.showModal();
    });
  });
  close.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', function () {
    enlarged.removeAttribute('src');
    enlarged.alt = '';
    caption.textContent = '';
  });
})();
