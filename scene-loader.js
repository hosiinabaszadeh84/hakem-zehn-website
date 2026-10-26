'use strict';
(() => {
  const host = document.getElementById('brain-stage');
  const trigger = document.getElementById('scene-load');
  if (!host || !trigger) return;
  const hint = document.getElementById('scene-hint');
  const connection = navigator.connection;
  const lightweight = matchMedia('(max-width: 760px)').matches || connection?.saveData || ['slow-2g','2g'].includes(connection?.effectiveType) || (navigator.deviceMemory && navigator.deviceMemory <= 2);
  let loading = false;
  host.setAttribute('aria-label','نمای مغز حاکم ذهن؛ برای فعال‌کردن مدل سه‌بعدی از دکمهٔ نمایش یا کلید Enter استفاده کنید.');
  trigger.hidden = false;
  const script = src => new Promise((resolve,reject) => {
    const element = document.createElement('script');
    element.src = src; element.onload = resolve; element.onerror = reject;
    document.head.append(element);
  });
  async function load() {
    if (loading) return;
    loading = true; trigger.disabled = true; trigger.textContent = 'در حال آماده‌سازی مدل…';
    try {
      await script('assets/vendor/three.min.js');
      await script('assets/vendor/GLTFLoader.js');
      await script('scene.js');
      trigger.hidden = true;
      if (!host.classList.contains('is-ready')) hint.textContent = 'نمای سبک؛ مدل سه‌بعدی در این مرورگر در دسترس نیست.';
    } catch (_) {
      // Keep the brand poster and readable content when the network or WebGL fails.
      trigger.hidden = true;
      hint.textContent = 'نمای سبک؛ مدل سه‌بعدی در دسترس نیست.';
      host.dataset.modelLoaded = 'unavailable';
    }
  }
  trigger.addEventListener('click', load);
  host.addEventListener('keydown', event => {if(event.key === 'Enter' || event.key === ' ') {event.preventDefault();load();}});
  if (lightweight) {hint.textContent = 'نمای سبک؛ نمایش سه‌بعدی اختیاری است.';return;}
  new IntersectionObserver((entries, observer) => {
    if (!entries.some(entry=>entry.isIntersecting)) return;
    observer.disconnect();
    if ('requestIdleCallback' in window) requestIdleCallback(load,{timeout:2500});
    else setTimeout(load,500);
  },{rootMargin:'0px',threshold:.1}).observe(host);
})();
