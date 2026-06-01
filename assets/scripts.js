document.addEventListener('DOMContentLoaded', function() {
  /* ── Carousel ── */
  (function() {
    var carousel = document.getElementById('carousel');
    if (!carousel) return;

    var items = carousel.querySelectorAll('.carousel-item');
    var indicators = carousel.querySelectorAll('.carousel-indicators button');
    var current = 0;
    var total = items.length;
    var autoTimer = null;

    function goTo(index) {
      items[current].classList.remove('active');
      indicators[current].classList.remove('active');
      indicators[current].removeAttribute('aria-current');

      current = (index + total) % total;

      items[current].classList.add('active');
      indicators[current].classList.add('active');
      indicators[current].setAttribute('aria-current', 'true');
    }

    function startAuto() {
      autoTimer = setInterval(function() { goTo(current + 1); }, 5000);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    /* Indicator buttons */
    indicators.forEach(function(btn, i) {
      btn.addEventListener('click', function() {
        goTo(i);
        resetAuto();
      });
    });

    /* Prev / Next buttons */
    var prevBtn = carousel.querySelector('.carousel-control-prev');
    var nextBtn = carousel.querySelector('.carousel-control-next');

    if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); resetAuto(); });

    /* Keyboard support */
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
    });

    /* Touch / swipe support */
    var touchStartX = 0;
    carousel.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function(e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
        resetAuto();
      }
    }, { passive: true });

    startAuto();
  })();

  /* ── Gallery ── */
  var galleryEl = document.querySelector('.gallery');
  if (galleryEl) {
    mauGallery(galleryEl, {
      columns: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3 },
      lightBox: true,
      lightboxId: 'myAwesomeLightbox',
      showTags: true,
      tagsPosition: 'top'
    });
  }
});
