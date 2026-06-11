class MauGallery {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      columns: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3 },
      lightBox: true,
      lightboxId: "myAwesomeLightbox",
      showTags: true,
      tagsPosition: "top",
      ...options,
    };

    this.init();
  }

  init() {
    this.createRowWrapper();

    if (this.options.lightBox) {
      this.createLightBox();
    }

    if (this.options.showTags) {
      this.showItemTags();
    }

    this.attachGalleryClickListeners();
  }

  createRowWrapper() {
    const wrapper = document.createElement("div");
    wrapper.className = "gallery-container";
    this.element.parentNode.insertBefore(wrapper, this.element);
    wrapper.appendChild(this.element);
  }

  createLightBox() {
    const style = document.createElement("style");
    style.textContent = `
      .modal-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.95);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-lightbox__container {
        position: relative;
        width: 90%;
        max-width: 900px;
      }
      .lightboxImage {
        width: 100%;
        height: auto;
        display: block;
      }
      .modal-close {
        position: absolute;
        top: 10px;
        right: 20px;
        background: none;
        border: none;
        color: #fff;
        font-size: 40px;
        cursor: pointer;
        z-index: 10000;
        transition: opacity 0.3s ease;
      }
      .modal-close:hover {
        opacity: 0.7;
      }
      .mg-prev, .mg-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        border: none;
        padding: 15px;
        font-size: 24px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        z-index: 10001;
      }
      .mg-prev:hover, .mg-next:hover {
        background-color: rgba(0, 0, 0, 0.8);
      }
      .mg-prev {
        left: 10px;
      }
      .mg-next {
        right: 10px;
      }
      @media(max-width: 650px) {
        .mg-prev, .mg-next {
          padding: 10px 8px;
          font-size: 18px;
        }
        .modal-close {
          font-size: 30px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  showItemTags() {
    const allTags = ["Tous"];
    const images = this.element.querySelectorAll("img.gallery-item");

    // Collect unique tags
    images.forEach((img) => {
      const tag = img.getAttribute("data-gallery-tag");
      if (tag && !allTags.includes(tag)) {
        allTags.push(tag);
      }
    });

    // Create filter buttons
    const filterContainer = document.querySelector(".gallery-filters");
    if (!filterContainer) {
      console.warn("Gallery filters container not found");
      return;
    }

    // Clear existing filters
    filterContainer.innerHTML = "";

    allTags.forEach((tag, index) => {
      const button = document.createElement("button");
      button.className = `nav-link ${index === 0 ? "active active-tag" : ""}`;
      button.setAttribute("data-images-toggle", tag === "Tous" ? "all" : tag);
      button.textContent = tag;

      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.filterByTag(e.target);
      });

      filterContainer.appendChild(button);
    });
  }

  filterByTag(button) {
    if (button.classList.contains("active-tag")) return;

    // Update active button
    document.querySelectorAll(".nav-link").forEach((btn) => {
      btn.classList.remove("active", "active-tag");
    });
    button.classList.add("active", "active-tag");

    // Filter images
    const tag = button.getAttribute("data-images-toggle");
    const images = this.element.querySelectorAll("img.gallery-item");

    images.forEach((img) => {
      const itemTag = img.getAttribute("data-gallery-tag");
      const column = img.closest(".item-column");

      if (tag === "all" || itemTag === tag) {
        column.style.display = "block";
        column.style.opacity = "0";
        setTimeout(() => {
          column.style.transition = "opacity 0.3s ease";
          column.style.opacity = "1";
        }, 0);
      } else {
        column.style.display = "none";
      }
    });
  }

  attachGalleryClickListeners() {
    this.element.querySelectorAll(".gallery-item").forEach((img) => {
      img.addEventListener("click", () => {
        this.openLightBox(img);
      });
    });
  }

  openLightBox(element) {
    const lightboxId = this.options.lightboxId;

    // Create lightbox HTML
    const lightboxHTML = `
      <div id="${lightboxId}" class="modal-lightbox" role="dialog" aria-modal="true">
        <button class="modal-close" aria-label="Fermer la galerie">&times;</button>
        <div class="modal-lightbox__container">
          <img class="lightboxImage" src="${element.src}" alt="${element.alt}" />
          <button class="mg-prev" aria-label="Image précédente">❮</button>
          <button class="mg-next" aria-label="Image suivante">❯</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", lightboxHTML);
    const modal = document.getElementById(lightboxId);

    // Close on background click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
        document.removeEventListener("keydown", this.keyboardHandler);
      }
    });

    // Close button
    modal.querySelector(".modal-close").addEventListener("click", () => {
      modal.remove();
      document.removeEventListener("keydown", this.keyboardHandler);
    });

    // Navigation
    modal.querySelector(".mg-prev").addEventListener("click", () => {
      this.prevImage(modal);
    });

    modal.querySelector(".mg-next").addEventListener("click", () => {
      this.nextImage(modal);
    });

    // Keyboard navigation
    this.keyboardHandler = (e) => {
      if (!document.getElementById(lightboxId)) {
        document.removeEventListener("keydown", this.keyboardHandler);
        return;
      }

      if (e.key === "ArrowLeft") this.prevImage(modal);
      if (e.key === "ArrowRight") this.nextImage(modal);
      if (e.key === "Escape") {
        modal.remove();
        document.removeEventListener("keydown", this.keyboardHandler);
      }
    };

    document.addEventListener("keydown", this.keyboardHandler);
  }

  getFilteredImages() {
    const activeTag =
      document
        .querySelector(".nav-link.active-tag")
        ?.getAttribute("data-images-toggle") || "all";
    const images = Array.from(
      this.element.querySelectorAll("img.gallery-item"),
    );

    if (activeTag === "all") {
      return images;
    }

    return images.filter(
      (img) => img.getAttribute("data-gallery-tag") === activeTag,
    );
  }

  prevImage(modal) {
    const currentSrc = modal.querySelector(".lightboxImage").src;
    const images = this.getFilteredImages();
    const currentIndex = images.findIndex((img) => img.src === currentSrc);
    const nextIndex =
      currentIndex - 1 >= 0 ? currentIndex - 1 : images.length - 1;

    modal.querySelector(".lightboxImage").src = images[nextIndex].src;
    modal.querySelector(".lightboxImage").alt = images[nextIndex].alt;
  }

  nextImage(modal) {
    const currentSrc = modal.querySelector(".lightboxImage").src;
    const images = this.getFilteredImages();
    const currentIndex = images.findIndex((img) => img.src === currentSrc);
    const nextIndex = currentIndex + 1 < images.length ? currentIndex + 1 : 0;

    modal.querySelector(".lightboxImage").src = images[nextIndex].src;
    modal.querySelector(".lightboxImage").alt = images[nextIndex].alt;
  }
}

window.initializeGalleries = function () {
  document.querySelectorAll(".gallery").forEach((gallery) => {
    new MauGallery(gallery, {
      columns: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3 },
      lightBox: true,
      lightboxId: "myAwesomeLightbox",
      showTags: true,
      tagsPosition: "top",
    });
  });
};

document.addEventListener("DOMContentLoaded", window.initializeGalleries);
