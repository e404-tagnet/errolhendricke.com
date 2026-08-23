(function () {
  'use strict';

  const state = {
    collections: [],
    collectionIndex: 0,
    artworkIndex: 0
  };

  const els = {
    collectionName: document.getElementById('collection-name'),
    collectionDesc: document.getElementById('collection-desc'),
    overviewThumbs: document.getElementById('overview-thumbs'),
    detailImg: document.getElementById('detail-img'),
    artworkTitle: document.getElementById('artwork-title'),
    artworkPrice: document.getElementById('artwork-price'),
    artworkDescription: document.getElementById('artwork-description'),
    prevCollection: document.getElementById('prev-collection'),
    nextCollection: document.getElementById('next-collection'),
    prevArtwork: document.getElementById('prev-artwork'),
    nextArtwork: document.getElementById('next-artwork'),
    menuToggle: document.querySelector('.menu-toggle'),
    siteNav: document.querySelector('.site-nav'),
    year: document.getElementById('year')
  };

  function getCollection() {
    return state.collections[state.collectionIndex] || { artworks: [] };
  }

  function getArtwork() {
    const collection = getCollection();
    return collection.artworks[state.artworkIndex];
  }

  function renderOverview() {
    const collection = getCollection();
    if (!collection || !collection.artworks.length) return;

    els.collectionName.textContent = collection.name;
    els.collectionDesc.textContent = collection.intro;

    els.overviewThumbs.innerHTML = '';
    collection.artworks.forEach((art, i) => {
      const btn = document.createElement('button');
      btn.className = 'overview-thumb' + (i === state.artworkIndex ? ' active' : '');
      btn.setAttribute('aria-label', `View ${art.title}`);
      btn.innerHTML = `<img src="${collection.folder}/${art.file}" alt="" loading="lazy" />`;
      btn.addEventListener('click', () => setArtwork(i));
      els.overviewThumbs.appendChild(btn);
    });
  }

  function renderDetail() {
    const collection = getCollection();
    const art = getArtwork();
    if (!collection || !art) return;

    els.detailImg.src = `${collection.folder}/${art.file}`;
    els.detailImg.alt = art.title;
    els.artworkTitle.textContent = art.title;
    els.artworkPrice.textContent = art.price;
    els.artworkDescription.innerHTML = `<p>${art.description || 'Description coming soon.'}</p>`;

    const thumbs = els.overviewThumbs.querySelectorAll('.overview-thumb');
    thumbs.forEach((t, i) => t.classList.toggle('active', i === state.artworkIndex));
  }

  function setCollection(index) {
    const len = state.collections.length;
    state.collectionIndex = ((index % len) + len) % len;
    state.artworkIndex = 0;
    renderOverview();
    renderDetail();
  }

  function setArtwork(index) {
    const collection = getCollection();
    const len = collection.artworks.length;
    state.artworkIndex = ((index % len) + len) % len;
    renderDetail();
  }

  function nextCollection() { setCollection(state.collectionIndex + 1); }
  function prevCollection() { setCollection(state.collectionIndex - 1); }
  function nextArtwork() { setArtwork(state.artworkIndex + 1); }
  function prevArtwork() { setArtwork(state.artworkIndex - 1); }

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
          document.body.classList.add('collection-ready');
        }
      })
      .catch(err => {
        console.error(err);
        els.collectionDesc.textContent = 'Unable to load collection data. Please check artworks.json.';
      });
  }

  function initEvents() {
    els.prevCollection.addEventListener('click', prevCollection);
    els.nextCollection.addEventListener('click', nextCollection);
    els.prevArtwork.addEventListener('click', prevArtwork);
    els.nextArtwork.addEventListener('click', nextArtwork);

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
