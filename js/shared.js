/* Loaded on every page: mobile menu and the audit form. */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    const set = open => {
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open);
    };
    toggle.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
    document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }

  const form = document.querySelector('form[name="audit"]');
  if (form) {
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.disabled = true;
      status.className = 'form-status';
      status.textContent = 'Sending…';
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString()
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.className = 'form-status ok';
        status.textContent = "Thanks. Your audit request is in, and we'll be in touch within one business day.";
      } catch (err) {
        status.innerHTML = 'That didn\'t send. Please email <a href="mailto:sam@centrehousemedia.com">sam@centrehousemedia.com</a> and we\'ll take it from there.';
      }
      btn.disabled = false;
    });
  }
})();
