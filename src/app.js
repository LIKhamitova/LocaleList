(function () {
  'use strict';

  var tbody = document.getElementById('locales-body');
  var loader = document.getElementById('loader');
  var errorEl = document.getElementById('error');
  var content = document.getElementById('content');
  var subtitle = document.getElementById('subtitle');
  var searchInput = document.getElementById('search');

  var allLocales = [];
  var filtered = [];

  /* ---- helpers ---- */

  function showError(msg) {
    loader.classList.add('hidden');
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }

  function esc(str) {
    if (typeof str !== 'string') return String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function flagClass(localeCode) {
    var parts = localeCode.split('-');
    var country = parts.length > 1 ? parts[1].toLowerCase() : '';
    return 'fi fi-' + country;
  }

  /* ---- render ---- */

  function render(list) {
    if (list.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="no-results">No locales match your search.</td></tr>';
      return;
    }

    var html = '';
    for (var i = 0; i < list.length; i++) {
      var loc = list[i];
      html += '<tr>' +
        '<td><span class="' + flagClass(loc.code) + ' flag"></span></td>' +
        '<td class="code">' + esc(loc.code) + '</td>' +
        '<td>' + esc(loc.language) + '</td>' +
        '<td>' + esc(loc.country) + '</td>' +
        '<td>' + esc(loc.currency.code) + ' ' + esc(loc.currency.symbol) + '</td>' +
        '<td>' + esc(loc.tld) + '</td>' +
        '</tr>';
    }
    tbody.innerHTML = html;
  }

  function update() {
    subtitle.textContent = filtered.length + ' of ' + allLocales.length + ' locales';
    render(filtered);
  }

  /* ---- search ---- */

  function filterLocales(query) {
    if (!query) {
      filtered = allLocales.slice();
    } else {
      var q = query.toLowerCase();
      filtered = allLocales.filter(function (loc) {
        return loc.code.toLowerCase().indexOf(q) !== -1 ||
               loc.language.toLowerCase().indexOf(q) !== -1 ||
               loc.country.toLowerCase().indexOf(q) !== -1;
      });
    }
    update();
  }

  searchInput.addEventListener('input', function () {
    filterLocales(searchInput.value);
  });

  /* ---- fetch ---- */

  fetch('/locales')
    .then(function (res) {
      if (!res.ok) throw new Error('Server returned ' + res.status);
      return res.json();
    })
    .then(function (data) {
      allLocales = Array.isArray(data) ? data : [];
      if (allLocales.length === 0) {
        showError('No locale data received.');
        return;
      }

      loader.classList.add('hidden');
      content.classList.remove('hidden');

      filtered = allLocales.slice();
      update();
    })
    .catch(function (err) {
      showError('Failed to load locales: ' + err.message);
    });
})();
