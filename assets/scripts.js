$(document).ready(function() {
  // Initialize gallery
  $('.gallery').mauGallery({
    columns: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3 },
    lightBox: true,
    lightboxId: 'myAwesomeLightbox',
    showTags: true,
    tagsPosition: 'top'
  });

  // Carousel navigation
  let currentSlide = 0;
  const slides = $('.carousel-item');
  const totalSlides = slides.length;

  function showSlide(n) {
    slides.removeClass('active');
    slides.eq(n).addClass('active');
  }

  $('.carousel-next').click(function() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  });

  $('.carousel-prev').click(function() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  });

  // Auto-rotate carousel
  setInterval(function() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }, 5000);

  // Smooth scroll navigation
  $('a[href^="#"]').on('click', function(e) {
    e.preventDefault();
    const target = $(this.getAttribute('href'));
    if (target.length) {
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 80
      }, 1000);
    }
  });

  // Form validation
  $('form').on('submit', function(e) {
    e.preventDefault();
    const form = $(this);
    const nom = form.find('input[name="nom"]').val();
    const email = form.find('input[name="email"]').val();
    const message = form.find('textarea[name="message"]').val();

    if (!nom || !email || !message) {
      alert('Veuillez remplir tous les champs');
      return false;
    }

    if (!validateEmail(email)) {
      alert('Email invalide');
      return false;
    }

    // Simulate sending (replace with actual backend call)
    alert('Votre message a été envoyé avec succès!');
    form[0].reset();
    return false;
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
