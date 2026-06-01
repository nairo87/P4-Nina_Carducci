(function() {
  /**
   * mauGallery — vanilla JS (no jQuery, no Bootstrap)
   */
  function mauGallery(element, options) {
    var opts = Object.assign({}, mauGallery.defaults, options);
    var tagsCollection = [];

    createRowWrapper(element);

    if (opts.lightBox) {
      createLightBox(element, opts.lightboxId, opts.navigation);
    }

    addListeners(element, opts);

    var items = element.querySelectorAll('.gallery-item');
    items.forEach(function(item) {
      responsiveImageItem(item);
      moveItemInRowWrapper(item, element);
      wrapItemInColumn(item, opts.columns);
      var theTag = item.dataset.galleryTag;
      if (opts.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
        tagsCollection.push(theTag);
      }
    });

    if (opts.showTags) {
      showItemTags(element, opts.tagsPosition, tagsCollection);
    }

    element.style.display = '';
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.5s';
    setTimeout(function() { element.style.opacity = '1'; }, 10);
  }

  mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: 'bottom',
    navigation: true
  };

  /* ── DOM helpers ── */

  function createRowWrapper(gallery) {
    var first = gallery.firstElementChild;
    if (!first || !first.classList.contains('row')) {
      var row = document.createElement('div');
      row.className = 'gallery-items-row row';
      gallery.appendChild(row);
    }
  }

  function wrapItemInColumn(element, columns) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('item-column', 'mb-4');

    if (typeof columns === 'number') {
      wrapper.classList.add('col-' + Math.ceil(12 / columns));
    } else if (typeof columns === 'object') {
      if (columns.xs) wrapper.classList.add('col-'    + Math.ceil(12 / columns.xs));
      if (columns.sm) wrapper.classList.add('col-sm-' + Math.ceil(12 / columns.sm));
      if (columns.md) wrapper.classList.add('col-md-' + Math.ceil(12 / columns.md));
      if (columns.lg) wrapper.classList.add('col-lg-' + Math.ceil(12 / columns.lg));
      if (columns.xl) wrapper.classList.add('col-xl-' + Math.ceil(12 / columns.xl));
    } else {
      console.error('Columns should be defined as numbers or objects. ' + typeof columns + ' is not supported.');
      return;
    }

    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
  }

  function moveItemInRowWrapper(element, gallery) {
    var row = gallery.querySelector('.gallery-items-row');
    if (row) row.appendChild(element);
  }

  function responsiveImageItem(element) {
    if (element.tagName === 'IMG') {
      element.classList.add('img-fluid');
    }
  }

  /* ── Lightbox ── */

  function createLightBox(gallery, lightboxId, navigation) {
    var id = lightboxId || 'galleryLightbox';

    var modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = id;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');

    var prevBtn = navigation
      ? '<button class="mg-prev" aria-label="Image précédente">&lt;</button>'
      : '<span style="display:none"></span>';
    var nextBtn = navigation
      ? '<button class="mg-next" aria-label="Image suivante">&gt;</button>'
      : '<span style="display:none"></span>';

    modal.innerHTML =
      '<div class="modal-dialog">' +
        '<div class="modal-content">' +
          '<button class="modal-close" aria-label="Fermer">&times;</button>' +
          '<div class="modal-body">' +
            prevBtn +
            '<img class="lightboxImage img-fluid" alt="Contenu de l\'image affichée dans la modale au clic" />' +
            nextBtn +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    /* Close on overlay click */
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal(id);
    });
    modal.querySelector('.modal-close').addEventListener('click', function() {
      closeModal(id);
    });
    /* Close on Escape */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal(id);
    });
  }

  function openModal(lightboxId, src) {
    var modal = document.getElementById(lightboxId);
    if (!modal) return;
    modal.querySelector('.lightboxImage').setAttribute('src', src);
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(lightboxId) {
    var modal = document.getElementById(lightboxId);
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ── Navigation ── */

  function getImagesCollection(activeTag) {
    var imagesCollection = [];
    document.querySelectorAll('.item-column').forEach(function(col) {
      var img = col.querySelector('img');
      if (!img) return;
      if (activeTag === 'all' || img.dataset.galleryTag === activeTag) {
        imagesCollection.push(img);
      }
    });
    return imagesCollection;
  }

  function prevImage(lightboxId) {
    var lightboxSrc = document.querySelector('.lightboxImage').getAttribute('src');
    var activeTag = (document.querySelector('.tags-bar span.active-tag') || {}).dataset
      ? document.querySelector('.tags-bar span.active-tag').dataset.imagesToggle
      : 'all';
    var imgs = getImagesCollection(activeTag);
    var index = 0;
    imgs.forEach(function(img, i) {
      if (img.getAttribute('src') === lightboxSrc) index = i;
    });
    var prev = imgs[index - 1] || imgs[imgs.length - 1];
    document.querySelector('.lightboxImage').setAttribute('src', prev.getAttribute('src'));
  }

  function nextImage(lightboxId) {
    var lightboxSrc = document.querySelector('.lightboxImage').getAttribute('src');
    var activeTag = (document.querySelector('.tags-bar span.active-tag') || {}).dataset
      ? document.querySelector('.tags-bar span.active-tag').dataset.imagesToggle
      : 'all';
    var imgs = getImagesCollection(activeTag);
    var index = 0;
    imgs.forEach(function(img, i) {
      if (img.getAttribute('src') === lightboxSrc) index = i;
    });
    var next = imgs[index + 1] || imgs[0];
    document.querySelector('.lightboxImage').setAttribute('src', next.getAttribute('src'));
  }

  /* ── Tags ── */

  function showItemTags(gallery, position, tags) {
    var tagItems = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
    tags.forEach(function(value) {
      tagItems += '<li class="nav-item"><span class="nav-link" data-images-toggle="' + value + '">' + value + '</span></li>';
    });
    var tagsRow = document.createElement('ul');
    tagsRow.className = 'my-4 tags-bar nav nav-pills';
    tagsRow.innerHTML = tagItems;

    if (position === 'bottom') {
      gallery.appendChild(tagsRow);
    } else if (position === 'top') {
      gallery.insertBefore(tagsRow, gallery.firstChild);
    } else {
      console.error('Unknown tags position: ' + position);
    }
  }

  function filterByTag(tagEl) {
    if (tagEl.classList.contains('active-tag')) return;

    document.querySelectorAll('.active-tag').forEach(function(el) {
      el.classList.remove('active', 'active-tag');
    });
    tagEl.classList.add('active-tag', 'active');

    var tag = tagEl.dataset.imagesToggle;

    document.querySelectorAll('.gallery-item').forEach(function(item) {
      var col = item.closest('.item-column');
      if (!col) return;
      if (tag === 'all' || item.dataset.galleryTag === tag) {
        col.style.display = '';
        col.style.opacity = '0';
        col.style.transition = 'opacity 0.3s';
        setTimeout(function() { col.style.opacity = '1'; }, 10);
      } else {
        col.style.display = 'none';
      }
    });
  }

  /* ── Event listeners ── */

  function addListeners(gallery, opts) {
    gallery.addEventListener('click', function(e) {
      /* Gallery item */
      if (e.target.classList.contains('gallery-item') && e.target.tagName === 'IMG') {
        if (opts.lightBox) {
          openModal(opts.lightboxId || 'galleryLightbox', e.target.getAttribute('src'));
        }
      }
      /* Tag filter */
      if (e.target.classList.contains('nav-link')) {
        filterByTag(e.target);
      }
      /* Lightbox prev/next */
      if (e.target.classList.contains('mg-prev')) {
        prevImage(opts.lightboxId);
      }
      if (e.target.classList.contains('mg-next')) {
        nextImage(opts.lightboxId);
      }
    });
  }

  /* ── Public API ── */
  window.mauGallery = mauGallery;
})();
