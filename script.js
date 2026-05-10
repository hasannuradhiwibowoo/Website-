
'use strict';

/*DOM READY  */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initRevealOnScroll();
  initCounters();
  initBackToTop();
  initForm();
  initHeroParallax();
});

/*LOADER */
function initLoader() {
  const loader = document.getElementById('loader');
  const loaderBar = document.querySelector('.loader-bar');

  if (!loader || !loaderBar) return;

  document.body.classList.add('loading');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      loaderBar.style.width = '100%';

      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');

        // Trigger hero animations after loader
        setTimeout(() => {
          triggerHeroReveal();
        }, 200);
      }, 600);
    }
    loaderBar.style.width = Math.min(progress, 100) + '%';
  }, 80);
}

function triggerHeroReveal() {
  const heroElements = document.querySelectorAll('.hero .reveal');
  heroElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, i * 150);
  });
}

/*  NAVBAR */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], div[id]');

  if (!navbar) return;

  // Scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    updateActiveNavLink(navLinks, sections);
  }, { passive: true });

  // Active link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function updateActiveNavLink(navLinks, sections) {
  const scrollY = window.scrollY + 100;
  let currentSection = '';

  sections.forEach(section => {
    const sTop = section.offsetTop;
    const sHeight = section.offsetHeight;
    if (scrollY >= sTop && scrollY < sTop + sHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && href === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

/* MOBILE MENU  */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    animateHamburger(true);
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    animateHamburger(false);
  }

  hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on backdrop click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

function animateHamburger(open) {
  const spans = document.querySelectorAll('.hamburger span');
  if (!spans.length) return;

  if (open) {
    spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
}

/* SMOOTH SCROLL */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
}

/*  REVEAL ON SCROLL */
function initRevealOnScroll() {
  const revealEls = document.querySelectorAll('.reveal');

  // Exclude hero elements (handled by loader)
  const nonHeroReveal = Array.from(revealEls).filter(el => !el.closest('.hero'));

  if (!nonHeroReveal.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  nonHeroReveal.forEach(el => observer.observe(el));
}

/* COUNTER ANIMATION */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (!target) return;

  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/*BACK TO TOP */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* CONTACT FORM*/
function initForm() {
  const form = document.getElementById('kontakForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    const originalText = btn.innerHTML;

    btn.innerHTML = 'Mengirim... <i class="ri-loader-4-line"></i>';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    // Simulate send
    setTimeout(() => {
      btn.innerHTML = 'Terkirim! <i class="ri-check-line"></i>';
      btn.style.opacity = '1';
      btn.style.background = '#1a1a1a';
      btn.style.color = '#f8f8f8';
      btn.style.border = '1px solid #333';

      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.border = '';
        btn.style.opacity = '';
      }, 3000);
    }, 1500);
  });
}

/*HERO PARALLAX */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const grid = document.querySelector('.hero-grid-overlay');
  const floats = document.querySelectorAll('.hero-float');

  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;

    const parallaxFactor = scrollY * 0.4;

    if (grid) {
      grid.style.transform = `translateY(${parallaxFactor * 0.3}px)`;
    }

    floats.forEach((float, i) => {
      const factor = 0.15 + i * 0.08;
      float.style.transform = `translateY(${scrollY * factor}px) rotate(${scrollY * 0.02}deg)`;
    });
  }, { passive: true });
}

/*GALLERY HOVER */
(function initGalleryHover() {
  document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.galeri-item');
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        items.forEach(other => {
          if (other !== item) {
            other.style.filter = 'brightness(0.5)';
          }
        });
      });
      item.addEventListener('mouseleave', () => {
        items.forEach(other => {
          other.style.filter = '';
        });
      });
    });
  });
})();

/*KOMISI HOVER */
(function initKomisiHover() {
  document.addEventListener('DOMContentLoaded', () => {
    const divItems = document.querySelectorAll('.komisi-div-item');
    divItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const siblings = item.parentElement.querySelectorAll('.komisi-div-item');
        siblings.forEach(sib => {
          if (sib !== item) {
            sib.style.opacity = '0.4';
          }
        });
      });
      item.addEventListener('mouseleave', () => {
        const siblings = item.parentElement.querySelectorAll('.komisi-div-item');
        siblings.forEach(sib => {
          sib.style.opacity = '';
        });
      });
    });
  });
})();

/* SCROLL PROGRESS  */
(function initScrollProgress() {
  // Subtle page scroll progress on navbar bottom
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    background: rgba(255,255,255,0.4);
    transition: width 0.1s linear;
    width: 0%;
    pointer-events: none;
  `;
  navbar.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });
})();

/* CURSOR GLOW EFFECT */
(function initCursorGlow() {
  // Only on desktop
  if (window.innerWidth < 1024) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }

  animateGlow();

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });
})();

/*STAGGER CARDS*/
(function staggerCards() {
  document.addEventListener('DOMContentLoaded', () => {
    // Add stagger to cards in grid
    const grids = [
      '.stats-grid',
      '.inti-grid',
      '.komisi-grid',
      '.program-grid',
      '.galeri-grid'
    ];

    grids.forEach(gridSel => {
      const grid = document.querySelector(gridSel);
      if (!grid) return;

      const cards = grid.querySelectorAll('.reveal');
      cards.forEach((card, i) => {
        if (!card.classList.contains('reveal-delay-1') &&
            !card.classList.contains('reveal-delay-2') &&
            !card.classList.contains('reveal-delay-3') &&
            !card.classList.contains('reveal-delay-4')) {
          card.style.transitionDelay = (i * 0.08) + 's';
        }
      });
    });
  });
})();

/* TYPED EFFECT FOR HERO*/
(function initTypedEffect() {
  // Subtle animated underline scan on hero title words
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;

  // Add a shimmer sweep on load
  heroTitle.style.backgroundImage = 'linear-gradient(90deg, #f8f8f8 0%, #ffffff 50%, #f8f8f8 100%)';
  heroTitle.style.backgroundSize = '200% 100%';
  heroTitle.style.webkitBackgroundClip = 'text';
  heroTitle.style.backgroundClip = 'text';

  let pos = 0;
  function animateShimmer() {
    pos = (pos + 0.3) % 200;
    heroTitle.style.backgroundPosition = pos + '% 0';
    requestAnimationFrame(animateShimmer);
  }

  // Only run once on init for a brief period
  setTimeout(() => {
    heroTitle.style.backgroundImage = '';
    heroTitle.style.backgroundSize = '';
    heroTitle.style.webkitBackgroundClip = '';
    heroTitle.style.backgroundClip = '';
  }, 3000);
})();

/* SECTION DIVIDERS*/
(function addDividers() {
  // Handled by CSS ::before pseudo-elements
})();

/*INIT COMPLETE*/
console.log('%c MPK SMKN 1 BANTUL ', 'background:#f8f8f8; color:#080808; font-family:monospace; font-size:14px; font-weight:bold; padding:8px 16px; letter-spacing:4px;');
console.log('%c Website loaded successfully · Aktif · Kritis · Berintegritas ', 'color:#888; font-family:monospace; font-size:10px; letter-spacing:2px;');