// Interações do site (substitui o runtime da Hostinger)
(function () {
  // Animações de entrada ao rolar (mesmo comportamento do original)
  var animated = document.querySelectorAll('[data-animation-role], .transition:not(.transition--root-hidden)');
  function activate(el) {
    if (el.getAttribute('data-animation-role') === 'image') {
      var img = el.querySelector('img');
      var markLoaded = function () { el.classList.add('loaded'); };
      if (!img || img.complete) markLoaded(); else { img.addEventListener('load', markLoaded); img.addEventListener('error', markLoaded); }
    }
    el.setAttribute('data-animation-state', 'active');
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { activate(e.target); io.unobserve(e.target); } });
    }, { threshold: 0 });
    animated.forEach(function (el) { io.observe(el); });
  } else {
    animated.forEach(activate);
  }

  // Altura dos blocos de código embutido (linhas divisórias em iframe)
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.action !== 'iframeHeightUpdated') return;
    var el = document.getElementById(d.id);
    if (el) el.style.setProperty('--2a636e7b', d.height + 'px');
  });

  // Menu mobile (hambúrguer)
  document.querySelectorAll('.burger').forEach(function (burger) {
    var header = burger.closest('header');
    var dropdown = header && header.querySelector('.block-header-layout-mobile__dropdown');
    burger.addEventListener('click', function () {
      var open = !burger.classList.contains('burger--open');
      burger.classList.toggle('burger--open', open);
      if (dropdown) dropdown.classList.toggle('block-header-layout-mobile__dropdown--open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  });

  // Seletor de idioma (PT / EN)
  function setLang(sw, open) {
    sw.style.setProperty('--dcfd20ac', open ? 'visible' : 'hidden');
    sw.style.setProperty('--021cac82', open ? 'auto' : '0');
    sw.style.setProperty('--1a67d35b', open ? 'rotate(180deg)' : 'none');
    sw.dataset.open = open ? '1' : '';
  }
  var switchers = document.querySelectorAll('.language-switcher');
  switchers.forEach(function (sw) {
    var btn = sw.querySelector('.language-switcher__button');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !sw.dataset.open;
      switchers.forEach(function (o) { setLang(o, false); });
      setLang(sw, open);
    });
  });
  document.addEventListener('click', function () {
    switchers.forEach(function (sw) { setLang(sw, false); });
  });

  // Formulário de contato: abre o e-mail com os dados preenchidos
  var EMAIL = 'urlandipre@gmail.com';
  document.querySelectorAll('form.form__control').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll('input, textarea');
      var missing = false, lines = [], name = '';
      fields.forEach(function (f) {
        var label = form.querySelector('label[for="' + f.id + '"]');
        var text = label ? label.textContent.replace('*', '').trim() : f.id;
        if (!f.value.trim()) { missing = true; f.style.borderColor = '#d63163'; } else { f.style.borderColor = ''; }
        if (!name) name = f.value.trim();
        lines.push(text + ': ' + f.value.trim());
      });
      if (missing) return;
      window.location.href = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent('Contato pelo site - ' + name) +
        '&body=' + encodeURIComponent(lines.join('\n\n'));
    });
  });
})();
