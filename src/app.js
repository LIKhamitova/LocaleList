(function () {
  'use strict';

  const tbody = document.getElementById('locales-body');
  const loader = document.getElementById('loader');
  const errorEl = document.getElementById('error');
  const wrapper = document.getElementById('table-wrapper');

  function showError(msg) {
    loader.classList.add('hidden');
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }

  function render(locales) {
    loader.classList.add('hidden');

    if (!Array.isArray(locales) || locales.length === 0) {
      showError('No locale data received.');
      return;
    }

    let html = '';
    for (const loc of locales) {
      html += '<tr>'
        + '<td><code>' + esc(loc.code) + '</code></td>'
        + '<td>'
          + '<div>' + esc(loc.language) + '</div>'
          + '<div class="label-sub">' + esc(loc.country) + '</div>'
        + '</td>'
        + '<td>'
          + '<div>' + esc(loc.currency.code) + ' ' + esc(loc.currency.symbol) + '</div>'
          + '<div class="label-sub">' + esc(loc.tld) + '</div>'
        + '</td>'
        + '<td class="flag-cell">' + loc.flag + '</td>'
        + '<td>'
          + '<div>' + esc(loc.timezone) + '</div>'
          + '<div class="label-sub">' + esc(loc.capital) + '</div>'
        + '</td>'
        + '</tr>';
    }

    tbody.innerHTML = html;
    wrapper.classList.remove('hidden');
  }

  function esc(str) {
    if (typeof str !== 'string') return String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Fetch locales from the same origin
  fetch('/locales')
    .then(function (res) {
      if (!res.ok) {
        throw new Error('Server returned ' + res.status);
      }
      return res.json();
    })
    .then(render)
    .catch(function (err) {
      showError('Failed to load locales: ' + err.message);
    });
})();
