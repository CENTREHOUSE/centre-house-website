/* Base behaviour for the service pages (index.html and about.html carry their own inline copy). */
(function () {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 60);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(num => {
        if (num.dataset.counted) return;
        num.dataset.counted = '1';
        const target = +num.dataset.count, pre = num.dataset.prefix || '', suf = num.dataset.suffix || '';
        const dec = (num.dataset.count.split('.')[1] || '').length, start = performance.now();
        (function tick(now) {
          const p = Math.min((now - start) / 1400, 1), ease = 1 - Math.pow(1 - p, 3);
          num.textContent = pre + (ease * target).toLocaleString('en-AU', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
      obs.unobserve(e.target);
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  function split(node) {
    if (node.nodeType === 3) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (/\S/.test(part)) {
          const s = document.createElement('span'); s.className = 'hl-word'; s.textContent = part; frag.appendChild(s);
        } else if (part) frag.appendChild(document.createTextNode(part));
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === 1 && node.tagName !== 'BR') Array.from(node.childNodes).forEach(split);
  }
  document.querySelectorAll('.sv-hl,.section-title,.contact-hl,.intro-hl').forEach(el => Array.from(el.childNodes).forEach(split));

  const pt = document.getElementById('page-transition');
  if (pt) {
    requestAnimationFrame(() => requestAnimationFrame(() => pt.classList.add('is-revealed')));
    addEventListener('pageshow', e => { if (e.persisted) pt.classList.add('is-revealed'); });
    document.querySelectorAll('a[href]').forEach(a => {
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || a.target === '_blank') return;
      if (url.hash && url.pathname === location.pathname) return;
      if (!/\.html$/.test(url.pathname) && url.pathname !== '/') return;
      a.addEventListener('click', e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        pt.style.transition = 'transform .65s cubic-bezier(.76,0,.24,1)';
        pt.classList.remove('is-revealed');
        setTimeout(() => { location.href = a.href; }, 680);
      });
    });
  }
})();
