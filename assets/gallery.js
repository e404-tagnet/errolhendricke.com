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
    image: document.getElementById('artwork-image'),
    title: document.getElementById('artwork-title'),
    price: document.getElementById('artwork-price'),
    dots: document.getElementById('gallery-dots'),
    prevCollection: document.getElementById('prev-collection'),
    nextCollection: document.getElementById('next-collection'),
    prevImage: document.getElementById('prev-image'),
    nextImage: document.getElementById('next-image'),
    year: document.getElementById('year'),
    menuToggle: document.querySelector('.menu-toggle'),
    siteNav: document.querySelector('.site-nav')
  };

  function setImage(index) {
    const collection = state.collections[state.collectionIndex];
    if (!collection || !collection.artworks.length) return;
    state.imageIndex = ((index % collection.artworks.length) + collection.artworks.length) % collection.artworks.length;
    const art = collection.artworks[state.imageIndex];
    const src = `${collection.folder}/${art.file}`;
    els.image.src = src;
    els.image.alt = art.title;
    els.title.textContent = art.title;
    els.price.textContent = art.price;
    renderDots();
  }

  function setCollection(index) {
    state.collectionIndex = ((index % state.collections.length) + state.collections.length) % state.collections.length;
    const collection = state.collections[state.collectionIndex];
    els.collectionName.textContent = collection.name;
    els.collectionIntro.textContent = collection.intro;
    els.collectionCounter.textContent = `${state.collectionIndex + 1} / ${state.collections.length}`;
    state.imageIndex = 0;
    setImage(0);
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
