(function () {
  // Show only in October. JS months are 0-based: 9 === October.
  const now = new Date();
  const isOctober = now.getMonth() === 9;

  // Key ensures it won't reappear after closing (scoped per year).
  const key = `pg_giveaway_oct_${now.getFullYear()}_dismissed`;

  const modal = document.getElementById('giveaway-modal');
  if (!modal) return;

  function openModal() {
    modal.setAttribute('aria-hidden', 'false');
    trapFocus();
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    localStorage.setItem(key, '1');
    releaseFocus();
  }

  // Don’t show if dismissed before, or if not October.
  if (!isOctober || localStorage.getItem(key) === '1') {
    modal.setAttribute('aria-hidden', 'true');
    return;
  }

  // Open on first page load after a tiny delay (feels nicer)
  window.addEventListener('load', () => {
    setTimeout(openModal, 400);
  });

  // Close handlers
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-gw-close]')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // Simple focus trap for accessibility
  let prevFocus = null;
  function trapFocus() {
    prevFocus = document.activeElement;
    const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusables.length) focusables[0].focus();
    function cycle(e) {
      if (e.key !== 'Tab') return;
      const items = Array.from(focusables).filter(el => !el.hasAttribute('disabled'));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
    modal.addEventListener('keydown', cycle);
    modal._cycle = cycle;
  }
  function releaseFocus() {
    if (modal._cycle) modal.removeEventListener('keydown', modal._cycle);
    if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
  }
})();
