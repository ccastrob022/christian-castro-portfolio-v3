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
