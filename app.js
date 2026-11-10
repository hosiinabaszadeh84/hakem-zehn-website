'use strict';
(() => {
  const menuButton = document.querySelector('.menu-button');
  const navigation = document.getElementById('navigation');
  const dropdownItems = [...document.querySelectorAll('.nav-item.has-dropdown')];

  const closeDropdowns = exceptItem => {
    dropdownItems.forEach(item => {
      if (item === exceptItem) return;
      item.classList.remove('is-open');
      const btn = item.querySelector('.nav-trigger');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };

  const closeMenu = () => {
    closeDropdowns();
    if (!navigation || !menuButton) return;
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'باز کردن منو');
  };

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      navigation.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
      if (!open) closeDropdowns();
    });

    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    dropdownItems.forEach(item => {
      const trigger = item.querySelector('.nav-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', event => {
        event.stopPropagation();
        const willOpen = !item.classList.contains('is-open');
        closeDropdowns(item);
        item.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
      });
    });

    // Highlight current page link in unified dropdown header
    const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    navigation.querySelectorAll('a[href]').forEach(link => {
      const raw = link.getAttribute('href') || '';
      if (raw.startsWith('http') || raw.startsWith('#')) return;
      const targetFile = (raw.replace(/^\.\//, '').split('#')[0] || 'index.html').toLowerCase();
      if (targetFile === currentFile && !raw.includes('#')) {
        link.setAttribute('aria-current', 'page');
        const parentItem = link.closest('.nav-item.has-dropdown');
        const trigger = parentItem?.querySelector('.nav-trigger');
        if (trigger) trigger.classList.add('has-active');
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const openDrop = dropdownItems.find(item => item.classList.contains('is-open'));
      if (openDrop) {
        const trigger = openDrop.querySelector('.nav-trigger');
        closeDropdowns();
        if (trigger) trigger.focus();
        return;
      }
      if (menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('.has-dropdown')) closeDropdowns();
      if (!event.target.closest('.nav')) closeMenu();
    });

    matchMedia('(min-width: 961px)').addEventListener('change', event => {
      if (event.matches) closeMenu();
    });
  }

  const previews = {
    dashboard: { src: 'assets/dashboard.webp', width: 620, height: 1377, title: 'داشبورد شخصی' },
    sos: { src: 'assets/sos-preview.webp', width: 540, height: 960, title: 'تمرین تنفس در بخش SOS' },
    analytics: { src: 'assets/analytics-preview.webp', width: 540, height: 960, title: 'مرور روندها و تحلیل ثبت‌ها' }
  };
  const tabs = [...document.querySelectorAll('[data-preview]')];
  const previewImage = document.getElementById('preview-image');
  const caption = document.getElementById('preview-caption');
  const panel = document.getElementById('preview-panel');
  if (tabs.length && previewImage && caption && panel) {
    function selectTab(tab, focus = false) {
      const data = previews[tab.dataset.preview];
      if (!data) return;
      tabs.forEach(item => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      previewImage.src = data.src;
      previewImage.alt = data.title;
      previewImage.width = data.width;
      previewImage.height = data.height;
      caption.textContent = data.title;
      panel.setAttribute('aria-labelledby', tab.id);
      if (focus) tab.focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', event => {
        let target;
        if (event.key === 'ArrowDown') target = (index + 1) % tabs.length;
        if (event.key === 'ArrowUp') target = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') target = 0;
        if (event.key === 'End') target = tabs.length - 1;
        if (target !== undefined) {
          event.preventDefault();
          selectTab(tabs[target], true);
        }
      });
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) {
    const currentYear = new Intl.NumberFormat('fa', { useGrouping: false }).format(new Date().getFullYear());
    if (yearEl.textContent !== currentYear) yearEl.textContent = currentYear;
  }

  const needs = {
    begin: { kicker: 'شروعِ قابل انجام', title: 'لازم نیست تمام مسیر را امروز بروی.', description: 'اولین قدم می‌تواند شناختن یک محرک، خواندن گام اول روش آسان یا جداکردن ثبت پورن و خودارضایی باشد. مسیر ۲۰ هفته‌ای و ثبت روزانه، به تصمیم تو شکل مشخص‌تری می‌دهند.', tool: 'همراه تو: مسیر مرحله‌ای و ثبت روزانه', link: 'راهنمای عملی ترک را ببین', href: 'tark-porn.html' },
    pause: { kicker: 'فضایی برای مکث', title: 'همین لحظه، برای خودت کمی فاصله بساز.', description: 'برای چند دقیقه از موقعیت فاصله بگیر. بخش SOS با تمرین تنفس و ابزارهای آرام‌سازی در دسترس توست. همین‌جا هم می‌توانی یک مکث کوتاه را امتحان کنی.', tool: 'همراه تو: SOS و تمرین تنفس', link: 'یک مکث را امتحان کن', href: '#calm-title' },
    return: { kicker: 'فرصت دوباره برای ادامه', title: 'یک لغزش، تمام مسیر تو را صفر نمی‌کند.', description: 'به‌جای سرزنش، ببین چه اتفاقی افتاد: کجا بودی و چه احساسی داشتی؟ ثبت تجربه و راهنمای ساعت اول پس از لغزش کمک می‌کند دوباره و سبک‌تر ادامه بدهی.', tool: 'همراه تو: ثبت جداگانه و راهنمای بازگشت', link: 'بعد از لغزش چه کنم؟', href: 'relapse.html' }
  };
  const needButtons = [...document.querySelectorAll('[data-need]')];
  if (needButtons.length) {
    needButtons.forEach(button => {
      button.addEventListener('click', () => {
        const choice = needs[button.dataset.need];
        if (!choice) return;
        needButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        for (const key of ['kicker', 'title', 'description', 'tool']) {
          const targetEl = document.getElementById('need-' + key);
          if (targetEl) targetEl.textContent = choice[key];
        }
        const link = document.getElementById('need-link');
        if (link) {
          link.href = choice.href;
          link.replaceChildren(document.createTextNode(choice.link + ' '));
          const arrow = document.createElement('span');
          arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '←'; link.append(arrow);
        }
      });
    });
  }

  let storeUrl;
  try {
    const url = new URL(window.HAKEM_SITE?.myketUrl || '');
    if (url.protocol === 'https:' && url.hostname === 'myket.ir' && /^\/app\/[\w.%-]+\/?$/.test(url.pathname) && !url.username && !url.password) storeUrl = url.href;
  } catch (_) { }
  if (storeUrl) {
    document.querySelectorAll('[data-myket-link]').forEach(link => {
      if (link.href !== storeUrl) link.href = storeUrl;
      if (link.target !== '_blank') link.target = '_blank';
      if (link.rel !== 'noopener noreferrer') link.rel = 'noopener noreferrer';
      if (link.hasAttribute('aria-disabled')) link.removeAttribute('aria-disabled');
      if (link.hasAttribute('tabindex')) link.removeAttribute('tabindex');
    });
    document.querySelectorAll('[data-myket-label]').forEach(label => {
      if (!label.textContent.trim()) label.textContent = 'دریافت رایگان از مایکت';
    });
    const note = document.querySelector('[data-store-note]');
    const storeNoteText = 'دریافت و به‌روزرسانی فقط از صفحهٔ رسمی حاکم ذهن در مایکت.';
    if (note && note.textContent !== storeNoteText) note.textContent = storeNoteText;
  }

  const breathButton = document.getElementById('breath-toggle');
  const breathLabel = document.getElementById('breath-label');
  const breathStatus = document.getElementById('breath-status');
  const calmPanel = document.querySelector('.calm-panel');
  if (breathButton && breathLabel && breathStatus && calmPanel) {
    let breathTimer = 0, breathStarted = 0;
    function stopBreathing(completed = false) {
      clearInterval(breathTimer); breathTimer = 0;
      calmPanel.classList.remove('is-breathing', 'is-exhaling');
      breathButton.setAttribute('aria-pressed', 'false');
      breathButton.textContent = 'یک مکث کوتاه ↗'; breathLabel.textContent = 'مکث';
      breathStatus.textContent = completed ? 'همین مکث کوچک هم یک قدم است.' : 'هر زمان خواستی می‌توانی متوقفش کنی.';
    }
    breathButton.addEventListener('click', () => {
      if (breathTimer) { stopBreathing(); return; }
      breathStarted = performance.now();
      calmPanel.classList.add('is-breathing');
      breathButton.setAttribute('aria-pressed', 'true'); breathButton.textContent = 'پایان مکث ×';
      breathStatus.textContent = 'آرام و بدون فشار؛ فقط اگر برایت راحت است.';
      const tick = () => {
        const elapsed = performance.now() - breathStarted;
        if (elapsed >= 32000) { stopBreathing(true); return; }
        const exhaling = elapsed % 8000 >= 4000;
        calmPanel.classList.toggle('is-exhaling', exhaling);
        breathLabel.textContent = exhaling ? 'بازدم آرام' : 'دم آرام';
      };
      tick(); breathTimer = setInterval(tick, 250);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && breathTimer) stopBreathing(); });
  }
})();
