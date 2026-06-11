// Vanilla JavaScript - No jQuery dependency!

document.addEventListener("DOMContentLoaded", function () {
  // ===== INJECT GALLERY IMAGES =====
  const galleryImages = [
    {
      tag: "Concert",
      src: "./assets/images/gallery/concerts/aaron-paul.webp",
      alt: "Concert photography - Nina Carducci",
    },
    {
      tag: "Entreprises",
      src: "./assets/images/gallery/entreprise/ali-morshedlou.webp",
      alt: "Portrait professionnel entreprise",
    },
    {
      tag: "Entreprises",
      src: "./assets/images/gallery/entreprise/jason-goodman.webp",
      alt: "Événement d'entreprise photo",
    },
    {
      tag: "Mariages",
      src: "./assets/images/gallery/mariage/hannah-busing.webp",
      alt: "Mariage - photo Nina Carducci",
    },
    {
      tag: "Portrait",
      src: "./assets/images/gallery/portraits/ade-tunji.webp",
      alt: "Portrait studio de qualité",
    },
    {
      tag: "Mariages",
      src: "./assets/images/gallery/mariage/jakob-owens.webp",
      alt: "Cérémonie mariage Bordeaux",
    },
    {
      tag: "Portrait",
      src: "./assets/images/gallery/portraits/nino-van-prattenburg.webp",
      alt: "Portrait noir et blanc",
    },
    {
      tag: "Concert",
      src: "./assets/images/gallery/concerts/austin-neill.webp",
      alt: "Concert live photography",
    },
    {
      tag: "Entreprises",
      src: "./assets/images/gallery/entreprise/mateus-campos-felipe.webp",
      alt: "Séance photo entreprise",
    },
  ];

  // Render gallery images
  const gallery = document.querySelector(".gallery");
  galleryImages.forEach((img) => {
    const div = document.createElement("div");
    div.className = "item-column";
    const imgEl = document.createElement("img");
    imgEl.className = "gallery-item";
    imgEl.setAttribute("data-gallery-tag", img.tag);
    imgEl.src = img.src;
    imgEl.alt = img.alt;
    imgEl.loading = "lazy";
    imgEl.decoding = "async";
    div.appendChild(imgEl);
    gallery.appendChild(div);
  });

  // ===== CAROUSEL NAVIGATION =====
  let currentSlide = 0;
  const slides = document.querySelectorAll(".carousel-item");
  const totalSlides = slides.length;

  function showSlide(n) {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[n].classList.add("active");
  }

  const nextBtn = document.querySelector(".carousel-next");
  const prevBtn = document.querySelector(".carousel-prev");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    });
  }

  // Auto-rotate carousel every 5 seconds
  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }, 5000);

  // ===== SMOOTH SCROLL NAVIGATION =====
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        const headerHeight = 80;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ===== FORM VALIDATION =====
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nom = form.querySelector('input[name="nom"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const message = form
        .querySelector('textarea[name="message"]')
        .value.trim();

      // Validation
      if (!nom || !email || !message) {
        alert("Veuillez remplir tous les champs");
        return false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Email invalide");
        return false;
      }

      // Success message
      alert("Votre message a été envoyé avec succès!");
      form.reset();
      return false;
    });
  }
});
