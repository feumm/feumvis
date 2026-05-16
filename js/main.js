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
      link.style.color = '#110828';
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
