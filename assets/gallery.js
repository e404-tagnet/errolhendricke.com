(function () {
  'use strict';

  const state = {
    collections: [],
    collectionIndex: 0,
    imageIndex: 0,
    scrolling: false
  };

  const els = {
    collectionName: document.getElementById('collection-name'),
    collectionIntro: document.getElementById('collection-intro'),
    collectionCounter: document.getElementById('collection-counter'),
    collectionThumbs: document.getElementById('collection-thumbs'),
    viewport: document.querySelector('.carousel-viewport'),
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

  function getRealSlides() {
    return Array.from(els.track.querySelectorAll('.carousel-slide:not(.clone)'));
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

  function createSlide(art, collection, isClone) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide' + (isClone ? ' clone' : '');

    // Split description into first paragraph + remainder for expander
    let firstPara = '';
    let restParas = '';
    let hasExpander = false;
    const rawDescription = art.description || 'Description coming soon.';
    const paras = rawDescription.split(/\n+/).filter(p => p.trim());
    if (paras.length > 1) {
      firstPara = paras[0];
      restParas = paras.slice(1).join('\n\n');
      hasExpander = true;
    } else {
      firstPara = rawDescription;
    }

    const expanderHtml = hasExpander
      ? `<div class="artwork-description-fade" aria-hidden="false"></div>
         <button class="artwork-continue" type="button" aria-expanded="false">Continue reading</button>
         <div class="artwork-description-rest" aria-hidden="true"><p>${restParas.replace(/\n\n/g, '</p><p>')}</p></div>`
      : '';

    slide.innerHTML = `
      <figure class="artwork-frame">
        <img src="${collection.folder}/${art.file}" alt="${art.title}" loading="lazy" />
        <figcaption class="artwork-caption">
          <span class="artwork-title">${art.title}</span>
          <span class="artwork-price">${art.price}</span>
        </figcaption>
      </figure>
      <div class="artwork-info">
        <div class="artwork-description-first"><p>${firstPara}</p></div>
        ${expanderHtml}
      </div>
    `;

    const img = slide.querySelector('img');
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(`${collection.folder}/${art.file}`, art.title);
    });

    const continueBtn = slide.querySelector('.artwork-continue');
    const fadeEl = slide.querySelector('.artwork-description-fade');
    const restEl = slide.querySelector('.artwork-description-rest');
    if (continueBtn && restEl) {
      continueBtn.addEventListener('click', () => {
        const expanded = continueBtn.getAttribute('aria-expanded') === 'true';
        continueBtn.setAttribute('aria-expanded', String(!expanded));
        restEl.setAttribute('aria-hidden', String(expanded));
        restEl.classList.toggle('open', !expanded);
        if (fadeEl) fadeEl.classList.toggle('hidden', !expanded);
        continueBtn.textContent = expanded ? 'Continue reading' : 'Show less';
        if (!expanded) {
          setTimeout(() => continueBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
        }
      });
    }

    return slide;
  }

  function renderSlides() {
    const collection = getCollection();
    if (!collection || !collection.artworks.length) return;

    els.track.innerHTML = '';
    const artworks = collection.artworks;
    const len = artworks.length;

    // Clone last at start and first at end for infinite centering
    if (len > 1) {
      els.track.appendChild(createSlide(artworks[len - 1], collection, true));
    }
    artworks.forEach((art) => {
      els.track.appendChild(createSlide(art, collection, false));
    });
    if (len > 1) {
      els.track.appendChild(createSlide(artworks[0], collection, true));
    }

    state.imageIndex = 0;
    renderDots();
    renderThumbs();

    // Center on the real first slide (index 1) without animation
    requestAnimationFrame(() => {
      const realSlides = getRealSlides();
      if (realSlides.length && len > 1) {
        realSlides[0].scrollIntoView({ inline: 'center', block: 'nearest' });
      }
    });
  }

  function scrollToIndex(index, smooth = true) {
    const realSlides = getRealSlides();
    if (!realSlides.length) return;

    const len = realSlides.length;
    state.imageIndex = ((index % len) + len) % len;

    const target = realSlides[state.imageIndex];
    if (!target) return;

    state.scrolling = true;
    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', inline: 'center', block: 'nearest' });

    if (els.collectionCounter) {
      els.collectionCounter.textContent = `${state.imageIndex + 1} / ${len}`;
    }
    renderDots();
    updateThumbs();

    clearTimeout(state.scrollTimeout);
    state.scrollTimeout = setTimeout(() => { state.scrolling = false; }, 650);
  }

  function setImage(index) {
    scrollToIndex(index, true);
  }

  function setCollection(index) {
    const len = state.collections.length;
    state.collectionIndex = ((index % len) + len) % len;
    const collection = getCollection();
    els.collectionName.textContent = collection.name;
    els.collectionIntro.textContent = collection.intro;
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
      btn.addEventListener('click', () => scrollToIndex(i, true));
      els.dots.appendChild(btn);
    });
  }

  function handleScrollEnd() {
    if (state.scrolling) return;

    const slides = getSlides();
    const realSlides = getRealSlides();
    if (!slides.length || !realSlides.length) return;

    const viewportCenter = els.viewport.getBoundingClientRect().left + els.viewport.getBoundingClientRect().width / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    slides.forEach((slide, i) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const dist = Math.abs(slideCenter - viewportCenter);
      if (dist < closestDistance) {
        closestDistance = dist;
        closestIndex = i;
      }
    });

    const len = realSlides.length;
    // If centered on leading clone, jump to last real slide
    if (slides[closestIndex].classList.contains('clone')) {
      const isLastClone = closestIndex === slides.length - 1;
      state.imageIndex = isLastClone ? 0 : len - 1;
      const target = realSlides[state.imageIndex];
      state.scrolling = true;
      target.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
      setTimeout(() => { state.scrolling = false; }, 50);
    } else {
      state.imageIndex = closestIndex - 1;
    }

    if (els.collectionCounter) {
      els.collectionCounter.textContent = `${state.imageIndex + 1} / ${len}`;
    }
    renderDots();
    updateThumbs();
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

  function nextImage() { scrollToIndex(state.imageIndex + 1, true); }
  function prevImage() { scrollToIndex(state.imageIndex - 1, true); }
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

    let scrollTimeout;
    els.viewport.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150);
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => scrollToIndex(state.imageIndex, false), 120);
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
