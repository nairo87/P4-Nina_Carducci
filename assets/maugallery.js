(function ($) {
  $.fn.mauGallery = function (options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];

    return this.each(function () {
      $.fn.mauGallery.methods.createRowWrapper($(this));

      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox($(this), options.lightboxId);
      }

      $.fn.mauGallery.methods.showItemTags(
        $(this),
        options.showTags,
        options.tagsPosition,
      );

      $(".gallery-item").on("click", function () {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      });
    });
  };

  $.fn.mauGallery.defaults = {
    columns: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3 },
    lightBox: true,
    lightboxId: "myAwesomeLightbox",
    showTags: true,
    tagsPosition: "top",
  };

  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      element.wrap('<div class="gallery-container"></div>');
    },

    openLightBox(element, lightboxId) {
      $("body").append(
        `<div id="${lightboxId}" class="modal-lightbox" role="dialog" aria-modal="true">
          <button class="modal-close" aria-label="Fermer la galerie">&times;</button>
          <div class="modal-lightbox__container">
            <img class="lightboxImage" src="${element.attr("src")}" alt="${element.attr("alt")}" />
            <button class="mg-prev" aria-label="Image précédente">❮</button>
            <button class="mg-next" aria-label="Image suivante">❯</button>
          </div>
        </div>`,
      );

      const modal = $(`#${lightboxId}`);
      modal.on("click", function (e) {
        if (e.target === this) $(this).remove();
      });

      modal.find(".modal-close").on("click", function () {
        modal.remove();
      });

      modal.find(".mg-prev").on("click", function () {
        $.fn.mauGallery.methods.prevImage(lightboxId);
      });

      modal.find(".mg-next").on("click", function () {
        $.fn.mauGallery.methods.nextImage(lightboxId);
      });

      $(document).on("keydown", function (e) {
        if ($(`#${lightboxId}`).length) {
          if (e.key === "ArrowLeft")
            $.fn.mauGallery.methods.prevImage(lightboxId);
          if (e.key === "ArrowRight")
            $.fn.mauGallery.methods.nextImage(lightboxId);
          if (e.key === "Escape") $(`#${lightboxId}`).remove();
        }
      });
    },

    prevImage(lightboxId) {
      let activeImage = null;
      $("img.gallery-item").each(function () {
        if (
          $(this).attr("src") === $(`#${lightboxId} .lightboxImage`).attr("src")
        ) {
          activeImage = $(this);
        }
      });

      let activeTag = $(".nav-link.active-tag").data("images-toggle") || "all";
      let imagesCollection = [];

      if (activeTag === "all") {
        $("img.gallery-item").each(function () {
          imagesCollection.push($(this));
        });
      } else {
        $("img.gallery-item").each(function () {
          if ($(this).data("gallery-tag") === activeTag) {
            imagesCollection.push($(this));
          }
        });
      }

      let index = 0;
      $(imagesCollection).each(function (i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i;
        }
      });

      let next =
        imagesCollection[index - 1] ||
        imagesCollection[imagesCollection.length - 1];
      $(`#${lightboxId} .lightboxImage`)
        .attr("src", $(next).attr("src"))
        .attr("alt", $(next).attr("alt"));
    },

    nextImage(lightboxId) {
      let activeImage = null;
      $("img.gallery-item").each(function () {
        if (
          $(this).attr("src") === $(`#${lightboxId} .lightboxImage`).attr("src")
        ) {
          activeImage = $(this);
        }
      });

      let activeTag = $(".nav-link.active-tag").data("images-toggle") || "all";
      let imagesCollection = [];

      if (activeTag === "all") {
        $("img.gallery-item").each(function () {
          imagesCollection.push($(this));
        });
      } else {
        $("img.gallery-item").each(function () {
          if ($(this).data("gallery-tag") === activeTag) {
            imagesCollection.push($(this));
          }
        });
      }

      let index = 0;
      $(imagesCollection).each(function (i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i;
        }
      });

      let next = imagesCollection[index + 1] || imagesCollection[0];
      $(`#${lightboxId} .lightboxImage`)
        .attr("src", $(next).attr("src"))
        .attr("alt", $(next).attr("alt"));
    },

    createLightBox(element, lightboxId) {
      const style = `
        <style>
          .modal-lightbox{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center}.modal-lightbox__container{position:relative;width:90%;max-width:900px}.lightboxImage{width:100%;height:auto}.modal-close{position:absolute;top:10px;right:20px;background:0;border:0;color:#fff;font-size:40px;cursor:pointer;z-index:10000}.mg-prev,.mg-next{position:absolute;top:50%;transform:translateY(-50%);background-color:rgba(0,0,0,0.5);color:#fff;border:none;padding:15px;font-size:24px;cursor:pointer;transition:background-color 0.3s ease;z-index:10001}.mg-prev:hover,.mg-next:hover{background-color:rgba(0,0,0,0.8)}.mg-prev{left:10px}.mg-next{right:10px}@media(max-width:650px){.mg-prev,.mg-next{padding:10px 8px;font-size:18px}.modal-close{font-size:30px}}
        </style>
      `;
      $("head").append(style);
    },

    showItemTags(element, showTags, tagsPosition) {
      if (!showTags) return;

      let allTags = ["Tous"];

      // ✅ FIX: element EST déjà .gallery, donc on l'utilise directement!
      // Ne pas faire: element.find('.gallery') car ça cherche .gallery DANS .gallery
      element.find("img.gallery-item").each(function () {
        const tag = $(this).data("gallery-tag");
        if (tag && !allTags.includes(tag)) {
          allTags.push(tag);
        }
      });

      const filterContainer = $(".gallery-filters");

      allTags.forEach((tag, index) => {
        const button = $(
          `<button class="nav-link ${index === 0 ? "active active-tag" : ""}" data-images-toggle="${tag === "Tous" ? "all" : tag}">${tag}</button>`,
        );
        filterContainer.append(button);
      });

      filterContainer.on("click", ".nav-link", function () {
        $.fn.mauGallery.methods.filterByTag.call(this, element);
      });
    },

    filterByTag() {
      if ($(this).hasClass("active-tag")) return;

      $(".nav-link").removeClass("active active-tag");
      $(this).addClass("active active-tag");

      const tag = $(this).data("images-toggle");
      const gallery = $(".gallery");

      gallery.find("img.gallery-item").each(function () {
        const itemTag = $(this).data("gallery-tag");
        if (tag === "all" || itemTag === tag) {
          $(this).closest(".item-column").fadeIn(300);
        } else {
          $(this).closest(".item-column").hide();
        }
      });
    },
  };
})(jQuery);
