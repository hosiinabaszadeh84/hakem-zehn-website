'use strict';
(() => {
  const host = document.getElementById('brain-stage');
  const trigger = document.getElementById('scene-load');
  if (!host || !trigger) return;
  const hint = document.getElementById('scene-hint');
  let loading = false;

  const loadScript = src => new Promise((resolve, reject) => {
    const element = document.createElement('script');
    element.src = src;
    element.onload = resolve;
    element.onerror = reject;
    document.head.append(element);
  });

  async function activate3D() {
    if (loading || host.classList.contains('is-ready')) return;
    loading = true;
    trigger.disabled = true;
    trigger.textContent = 'در حال آماده‌سازی…';
    try {
      await loadScript('assets/vendor/three.min.js');
      await loadScript('assets/vendor/GLTFLoader.js');
      await loadScript('scene.js');
      trigger.hidden = true;
    } catch (_) {
      trigger.hidden = true;
      if (hint) hint.textContent = 'نمایش پایدار مغز حاکم ذهن';
      host.dataset.modelLoaded = 'unavailable';
    }
  }

  trigger.addEventListener('click', activate3D);
  host.addEventListener('keydown', event => {
    if (!host.classList.contains('is-ready') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      activate3D();
    }
  });
})();
