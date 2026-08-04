(function () {
  'use strict';

  const state = {
    collections: [],
    collectionIndex: 0,
    imageIndex: 0
  };

  const els = {
    collectionName: document.getElementById('collection-name'),
    collectionIntro: document.getElementById('collection-intro'),
    collectionCounter: document.getElementById('collection-counter'),
    collectionThumbs: document.getElementById('collection-thumbs'),
    track: document.getElementById('carousel-track'),
    dots: document.getElementById('gallery-dots'),
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxClose: document.getElementById('lightbox-close'),
    prevCollection: document.getElementById('prev-collection'),
    nextCollection: document.getElementById('next-collection'),
    prevImage: document.getElementById('prev-image'),
    nextImage: document.getElementById('next-image'),
    year: document.getElementById('year'),
    menuToggle: document.querySelector('.menu-toggle'),
    siteNav: document.querySelector('.site-nav')
  };

  function getCollection() {
    return state.collections[state.collectionIndex];
  }

  function getSlides() {
    return Array.from(els.track.querySelectorAll('.carousel-slide'));
  }

  function renderThumbs() {
    const collection = getCollection();
    if (!collection || !collection.artworks.length || !els.collectionThumbs) return;

    els.collectionThumbs.innerHTML = '';
    collection.artworks.forEach((art, i) => {
      const btn = document.createElement('button');
      btn.className = 'collection-thumb' + (i === state.imageIndex ? ' active' : '');
      btn.setAttribute('aria-label', `View ${art.title}`);
      btn.innerHTML = `<img src="${collection.folder}/${art.file}" alt="" loading="lazy" />`;
      btn.addEventListener('click', () => setImage(i));
      els.collectionThumbs.appendChild(btn);
    });
  }

  function updateThumbs() {
    if (!els.collectionThumbs) return;
    const thumbs = els.collectionThumbs.querySelectorAll('.collection-thumb');
    thumbs.forEach((t, i) => t.classList.toggle('active', i === state.imageIndex));
  }

  function renderSlides() {
    const collection = getCollection();
    if (!collection || !collection.artworks.length) return;

    els.track.innerHTML = '';
    collection.artworks.forEach((art, i) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.innerHTML = `
        <figure class="artwork-frame">
          <img src="${collection.folder}/${art.file}" alt="${art.title}" loading="lazy" />
          <figcaption class="artwork-caption">
            <span class="artwork-title">${art.title}</span>
            <span class="artwork-price">${art.price}</span>
          </figcaption>
        </figure>
      `;
      const img = slide.querySelector('img');
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(`${collection.folder}/${art.file}`, art.title);
      });
      els.track.appendChild(slide);
    });
    positionTrack();
    renderDots();
    renderThumbs();
  }

  function positionTrack() {
    const slides = getSlides();
    if (!slides.length) return;

    const slide = slides[0];
    const slideWidth = slide.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(els.track).gap) || 0;
    const viewportWidth = els.track.parentElement.getBoundingClientRect().width;
    const centeringOffset = Math.max(0, (viewportWidth - slideWidth) / 2);
    const offset = state.imageIndex * (slideWidth + gap) - centeringOffset;
    els.track.style.transform = `translateX(-${offset}px)`;
  }

  function setImage(index) {
    const collection = getCollection();
    if (!collection || !collection.artworks.length) return;
    state.imageIndex = ((index % collection.artworks.length) + collection.artworks.length) % collection.artworks.length;
    if (els.collectionCounter) {
      els.collectionCounter.textContent = `${state.imageIndex + 1} / ${collection.artworks.length}`;
    }
    positionTrack();
    renderDots();
    updateThumbs();
  }

  function setCollection(index) {
    state.collectionIndex = ((index % state.collections.length) + state.collections.length) % state.collections.length;
    const collection = getCollection();
    els.collectionName.textContent = collection.name;
    els.collectionIntro.textContent = collection.intro;
    if (els.collectionCounter) {
      els.collectionCounter.textContent = `${state.imageIndex + 1} / ${collection.artworks.length}`;
    }
    state.imageIndex = 0;
    renderSlides();
  }

  function renderDots() {
    const collection = getCollection();
    els.dots.innerHTML = '';
    collection.artworks.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'dot' + (i === state.imageIndex ? ' active' : '');
      btn.setAttribute('aria-label', `Go to artwork ${i + 1}`);
      btn.addEventListener('click', () => setImage(i));
      els.dots.appendChild(btn);
    });
  }

  function openLightbox(src, alt) {
    if (!els.lightbox || !els.lightboxImg) return;
    els.lightboxImg.src = src;
    els.lightboxImg.alt = alt;
    els.lightbox.classList.add('open');
    els.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!els.lightbox) return;
    els.lightbox.classList.remove('open');
    els.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function nextImage() { setImage(state.imageIndex + 1); }
  function prevImage() { setImage(state.imageIndex - 1); }
  function nextCollection() { setCollection(state.collectionIndex + 1); }
  function prevCollection() { setCollection(state.collectionIndex - 1); }

  function loadData() {
    fetch('assets/artworks.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load artwork data');
        return r.json();
      })
      .then(data => {
        state.collections = data.collections;
        if (state.collections.length) {
          setCollection(0);
          document.body.classList.add('gallery-ready');
        }
      })
      .catch(err => {
        console.error(err);
        document.getElementById('collection-intro').textContent = 'Unable to load gallery data. Please check artworks.json.';
      });
  }

  function initEvents() {
    els.nextImage.addEventListener('click', nextImage);
    els.prevImage.addEventListener('click', prevImage);
    els.nextCollection.addEventListener('click', nextCollection);
    els.prevCollection.addEventListener('click', prevCollection);

    if (els.lightboxClose) els.lightboxClose.addEventListener('click', closeLightbox);
    if (els.lightbox) {
      els.lightbox.addEventListener('click', (e) => {
        if (e.target === els.lightbox) closeLightbox();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowDown') nextCollection();
      if (e.key === 'ArrowUp') prevCollection();
      if (e.key === 'Escape') closeLightbox();
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(positionTrack, 120);
    });

    if (els.menuToggle && els.siteNav) {
      els.menuToggle.addEventListener('click', () => {
        const open = els.siteNav.classList.toggle('open');
        els.menuToggle.setAttribute('aria-expanded', String(open));
      });
    }

    if (els.year) els.year.textContent = new Date().getFullYear();
  }

  loadData();
  initEvents();
})();
