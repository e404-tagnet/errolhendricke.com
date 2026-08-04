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
    track: document.getElementById('carousel-track'),
    dots: document.getElementById('gallery-dots'),
    prevCollection: document.getElementById('prev-collection'),
    nextCollection: document.getElementById('next-collection'),
    prevImage: document.getElementById('prev-image'),
    nextImage: document.getElementById('next-image'),
    year: document.getElementById('year'),
    menuToggle: document.querySelector('.menu-toggle'),
    siteNav: document.querySelector('.site-nav')
  };

  function getSlides() {
    return Array.from(els.track.querySelectorAll('.carousel-slide'));
  }

  function renderSlides() {
    const collection = state.collections[state.collectionIndex];
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
      slide.addEventListener('click', () => setImage(i));
      els.track.appendChild(slide);
    });
    positionTrack();
    renderDots();
  }

  function positionTrack() {
    const slides = getSlides();
    if (!slides.length) return;

    // Determine slide width + gap for precise translation
    const slide = slides[0];
    const style = window.getComputedStyle(slide);
    const slideWidth = slide.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(els.track).gap) || 0;
    const offset = state.imageIndex * (slideWidth + gap);
    els.track.style.transform = `translateX(-${offset}px)`;
  }

  function setImage(index) {
    const collection = state.collections[state.collectionIndex];
    if (!collection || !collection.artworks.length) return;
    state.imageIndex = ((index % collection.artworks.length) + collection.artworks.length) % collection.artworks.length;
    positionTrack();
    renderDots();
  }

  function setCollection(index) {
    state.collectionIndex = ((index % state.collections.length) + state.collections.length) % state.collections.length;
    const collection = state.collections[state.collectionIndex];
    els.collectionName.textContent = collection.name;
    els.collectionIntro.textContent = collection.intro;
    els.collectionCounter.textContent = `${state.collectionIndex + 1} / ${state.collections.length}`;
    state.imageIndex = 0;
    renderSlides();
  }

  function renderDots() {
    const collection = state.collections[state.collectionIndex];
    els.dots.innerHTML = '';
    collection.artworks.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'dot' + (i === state.imageIndex ? ' active' : '');
      btn.setAttribute('aria-label', `Go to artwork ${i + 1}`);
      btn.addEventListener('click', () => setImage(i));
      els.dots.appendChild(btn);
    });
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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowDown') nextCollection();
      if (e.key === 'ArrowUp') prevCollection();
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
