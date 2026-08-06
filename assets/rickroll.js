(function () {
  const trigger = document.querySelector('.rickroll-trigger');
  const overlay = document.getElementById('rickrollOverlay');
  if (!trigger || !overlay) return;

  const close = overlay.querySelector('.rickroll-close');
  const iframe = overlay.querySelector('iframe');
  const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';

  function open() {
    iframe.src = videoUrl;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function closeOverlay() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    iframe.src = '';
  }

  trigger.addEventListener('click', open);
  close.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeOverlay();
  });
})();
