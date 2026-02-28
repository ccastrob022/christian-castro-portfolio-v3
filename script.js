(() => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      links.classList.toggle('show');
    });

    // Close menu when clicking a link on mobile
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('show');
      });
    });
  }

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Scroll reveal
  const revealEls = document.querySelectorAll('.card, .timeline-item, .impact, .section-head');
  revealEls.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // Active nav highlight
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(s => navObserver.observe(s));
  }

  // Back to top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Animated counters on scroll
  const impactNums = document.querySelectorAll('.impact-number');
  if (impactNums.length && 'IntersectionObserver' in window) {
    impactNums.forEach(el => {
      el.dataset.target = el.textContent.trim();
      el.textContent = '0';
    });

    const animateCounter = (el) => {
      const raw = el.dataset.target;
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      const suffix = raw.replace(/[0-9.]/g, '');
      const duration = 1600;
      const start = performance.now();
      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * num) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.6 });

    impactNums.forEach(el => counterObserver.observe(el));
  }

  // Contact form: Netlify Forms via AJAX
  const form = document.getElementById('contactForm');
  if (form) {
    const btn = document.getElementById('formBtn');
    const hint = document.getElementById('formHint');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      btn.disabled = true;
      btn.textContent = 'Sending…';
      hint.textContent = '';
      hint.style.color = '';

      const data = new URLSearchParams(new FormData(form)).toString();

      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: data,
        });

        if (res.ok) {
          form.reset();
          btn.textContent = 'Message sent!';
          hint.textContent = 'Thanks — I\'ll get back to you within 1–2 business days.';
          hint.style.color = 'var(--clr-accent, #2563eb)';
        } else {
          throw new Error('Server error');
        }
      } catch {
        btn.disabled = false;
        btn.textContent = 'Send message';
        hint.textContent = 'Something went wrong. Please try emailing directly: criscastrob022@gmail.com';
        hint.style.color = '#dc2626';
      }
    });
  }
})();
