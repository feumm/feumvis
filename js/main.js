// ── PILL NAV SLIDING INDICATOR ──
(function () {
  const nav = document.querySelector('.pill-nav');
  const indicator = document.querySelector('.pill-indicator');
  const links = nav ? [...nav.querySelectorAll('.pill-nav-link')] : [];
  const activeLink = nav ? nav.querySelector('.pill-nav-link.active') : null;

  function moveIndicator(el, animated) {
    if (!indicator || !nav || !el) return;
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (!animated) indicator.style.transition = 'none';
    indicator.style.left = (elRect.left - navRect.left) + 'px';
    indicator.style.width = elRect.width + 'px';
    if (!animated) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        indicator.style.transition = '';
      }));
    }
  }

  if (activeLink) moveIndicator(activeLink, false);

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('active')) return;
      e.preventDefault();
      const href = link.href;
      moveIndicator(link, true);
      links.forEach(l => { if (l !== link) l.style.color = ''; });
      link.style.color = '#ffffff';
      setTimeout(() => { window.location.href = href; }, 310);
    });
  });
})();

// Word cycle
const exclusiveWords    = ['EXCLUSIVE', '.PSD', 'THUMBNAILS', 'TEMPLATES'];
const nonExclusiveWords = ['NON-EXCLUSIVE', '.PSD', 'THUMBNAILS', 'TEMPLATES'];

const words = document.title.includes('Non-Exclusive') ? nonExclusiveWords : exclusiveWords;

let wordIndex = 0;
const cycleEl  = document.querySelector('.word-cycle-text');
const cycleWrap = document.querySelector('.word-cycle');

function measureTextWidth(text) {
  const tmp = cycleEl.cloneNode(true);
  tmp.style.cssText = 'visibility:hidden;position:absolute;white-space:nowrap;';
  tmp.textContent = text;
  cycleWrap.appendChild(tmp);
  const w = tmp.offsetWidth;
  cycleWrap.removeChild(tmp);
  return w;
}

if (cycleEl && cycleWrap) {
  cycleWrap.style.width = cycleWrap.offsetWidth + 'px';

  setInterval(() => {
    cycleEl.classList.add('fade-out');
    const nextIndex = (wordIndex + 1) % words.length;
    cycleWrap.style.width = (measureTextWidth(words[nextIndex]) + 56) + 'px';

    setTimeout(() => {
      wordIndex = nextIndex;
      cycleEl.textContent = words[wordIndex];
      cycleEl.classList.remove('fade-out');
      cycleEl.classList.add('fade-in');
      requestAnimationFrame(() => requestAnimationFrame(() => cycleEl.classList.remove('fade-in')));
    }, 350);
  }, 2000);
}

// ── SORT & VIEW TOGGLE ──
const sortBtn     = document.getElementById('sortBtn');
const sortMenu    = document.getElementById('sortMenu');
const sortOptions = document.querySelectorAll('.sort-option');
const productGrid = document.getElementById('productGrid');
const viewBtns    = document.querySelectorAll('.view-btn');
const sortLabelEl = document.getElementById('sortLabel');

let originalOrder = productGrid
  ? [...productGrid.querySelectorAll(':scope > .card-wrap')]
  : [];

if (sortBtn && sortMenu) {
  sortBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = sortMenu.classList.toggle('open');
    sortBtn.classList.toggle('open', isOpen);
  });
  document.addEventListener('click', () => {
    sortMenu.classList.remove('open');
    sortBtn.classList.remove('open');
  });
  sortMenu.addEventListener('click', (e) => e.stopPropagation());
}

sortOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    const dir = opt.dataset.sort;
    sortOptions.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    if (sortLabelEl) {
      sortLabelEl.textContent = dir === 'default' ? 'Price' : dir === 'asc' ? 'Price ↑' : 'Price ↓';
    }
    sortMenu.classList.remove('open');
    sortBtn.classList.remove('open');
    if (!productGrid) return;
    if (dir === 'default') {
      originalOrder.forEach(c => productGrid.appendChild(c));
    } else {
      const cards = [...productGrid.querySelectorAll(':scope > .card-wrap')];
      cards.sort((a, b) => {
        const pa = parseFloat(a.dataset.price);
        const pb = parseFloat(b.dataset.price);
        return dir === 'asc' ? pa - pb : pb - pa;
      });
      cards.forEach(c => productGrid.appendChild(c));
    }
  });
});

viewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (productGrid) productGrid.classList.toggle('list-view', btn.dataset.view === 'list');
  });
});

// ── STICKY BUY NOW ──
const stickyCta  = document.getElementById('stickyCta');
const heroTarget = document.querySelector('.hero-wrap');

if (stickyCta && heroTarget) {
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        stickyCta.classList.remove('visible');
        stickyCta.setAttribute('aria-hidden', 'true');
      } else {
        stickyCta.classList.add('visible');
        stickyCta.setAttribute('aria-hidden', 'false');
      }
    },
    { threshold: 0.15 }
  );
  heroObserver.observe(heroTarget);
}

// ── SCROLL REVEAL ──
const scrollRevealEls = [
  { selector: '.inside-header',   delay: 0   },
  { selector: '.reviews-section', delay: 0   },
  { selector: '.review-card',     delay: 80, stagger: true },
];

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.revealDelay || '0', 10);
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.1 });

scrollRevealEls.forEach(({ selector, delay, stagger }) => {
  const els = document.querySelectorAll(selector);
  els.forEach((el, i) => {
    el.classList.add('scroll-reveal');
    el.dataset.revealDelay = stagger ? delay * (i + 1) : delay;
    revealObserver.observe(el);
  });
});

// ── WHAT'S INSIDE FOLDER ANIMATION ──
const folderItems = document.querySelectorAll('.folder-item');

if (folderItems.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.08 });

  folderItems.forEach(item => observer.observe(item));
}

// ── GUMROAD AUTOMATIC SOLD OUT CHECKER ──
(function () {
  const checkGumroadStock = async () => {
    // 1. Process Product Cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(async (card) => {
      let url = card.href;
      if (!url || !url.includes('gumroad.com')) return;

      // Clean the URL (remove tracking/variants)
      url = url.split('?')[0];

      // Inject the overlay markup structure so it is ready to transition smoothly
      const mediaContainer = card.querySelector('.card-media');
      if (mediaContainer && !mediaContainer.querySelector('.sold-out-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'sold-out-overlay';
        overlay.innerHTML = '<span class="sold-out-badge">SOLD OUT</span>';
        mediaContainer.appendChild(overlay);
      }

      try {
  // Use AllOrigins proxy to bypass the CORS block
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl);
  
  if (res.ok) {
    const data = await res.json();
    const html = data.contents; // AllOrigins wraps the page HTML inside 'contents'
    
    // Gumroad sets specific indicator strings or button states when sold out
    const isSoldOut = html.includes('Sold out') || 
                      html.includes('is no longer available') || 
                      html.includes('data-custom-delivery-text="Sold out"');

          if (isSoldOut) {
            card.classList.add('sold-out');
            card.addEventListener('click', (e) => {
              e.preventDefault();
              alert("Sorry! This exclusive package is already sold out.");
            });
          }
        }
      } catch (err) {
        console.warn('Could not check stock status for link:', url, err);
      }
    });

    // 2. Process Sticky CTA Buttons
    const stickyCtas = document.querySelectorAll('.sticky-cta-btn');
    stickyCtas.forEach(async (btn) => {
      let url = btn.href;
      if (!url || !url.includes('gumroad.com')) return;
      
      url = url.split('?')[0];

      try {
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl);
  
  if (res.ok) {
    const data = await res.json();
    const html = data.contents;
    
    const isSoldOut = html.includes('Sold out') || 
                      html.includes('is no longer available') || 
                      html.includes('data-custom-delivery-text="Sold out"');

          if (isSoldOut) {
            btn.classList.add('sold-out-cta');
            btn.style.background = '#3f3f46';
            btn.style.color = '#a1a1aa';
            btn.style.cursor = 'not-allowed';
            btn.textContent = 'SOLD OUT';
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              alert("Sorry! This product is already sold out.");
            });
          }
        }
      } catch (err) {
        console.warn('Could not check stock status for sticky CTA:', url, err);
      }
    });
  };

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkGumroadStock);
  } else {
    checkGumroadStock();
  }
})();

// ── HERO WORD ROTATION ENGINE ──
(function () {
  const words = ['Graphics', 'Motion', 'Animation'];
  const wordBox = document.getElementById('heroWordBox');
  const inner = document.getElementById('heroWordInner');
  if (!wordBox || !inner) return;

  // Insert all words dynamically
  inner.innerHTML = words.map((w, index) => 
    `<span class="hero-word-item${index === 0 ? ' active' : ''}" data-idx="${index}">${w}</span>`
  ).join('');

  const items = inner.querySelectorAll('.hero-word-item');
  let currentIdx = 0;
  let widths = [];

  function calculateWidths() {
    widths = Array.from(items).map(el => {
      // Temporarily clear absolute translation constraints to measure true un-translated horizontal box dimension
      const originalTransition = el.style.transition;
      el.style.transition = 'none';
      
      const rect = el.getBoundingClientRect();
      const measuredWidth = rect.width || el.offsetWidth;
      
      el.style.transition = originalTransition;
      return measuredWidth;
    });

    // Match the active item width instantly with some safety padding for extreme slanted italics & dropshadow borders
    const buffer = window.innerWidth <= 768 ? 8 : 14;
    wordBox.style.width = (widths[currentIdx] + buffer) + 'px';
  }

  // Calculate immediately and bind events
  calculateWidths();
  
  // Also run on fonts load and resize to maintain absolute pixel perfection
  window.addEventListener('load', calculateWidths);
  window.addEventListener('resize', calculateWidths);
  document.fonts.ready.then(calculateWidths);

  setInterval(() => {
    const outgoingIdx = currentIdx;
    currentIdx = (currentIdx + 1) % words.length;

    const outgoing = items[outgoingIdx];
    const incoming = items[currentIdx];

    if (outgoing && incoming) {
      outgoing.classList.remove('active');
      outgoing.classList.add('outgoing');

      incoming.classList.remove('outgoing');
      incoming.classList.add('active');

      // Update box width dynamically to glide to the new word's size smoothly
      const buffer = window.innerWidth <= 768 ? 8 : 14;
      wordBox.style.width = (widths[currentIdx] + buffer) + 'px';

      setTimeout(() => {
        outgoing.classList.remove('outgoing');
      }, 400);
    }
  }, 2300);
})();



