document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('[data-search-toggle]');
  var panel = document.querySelector('[data-header-search]');
  var form = panel ? panel.querySelector('[data-predictive-search-url]') : null;
  var input = document.querySelector('[data-predictive-search-input]');
  var resultsWrapper = document.querySelector('[data-header-search] [data-predictive-search-results]');
  if (!toggle || !panel || !form || !input || !resultsWrapper) return;

  var baseUrl = form.getAttribute('data-predictive-search-url');

  function openPanel() {
    toggle.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    input.focus();
  }

  function closePanel() {
    toggle.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  }

  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closePanel();
      toggle.focus();
    }
  });

  document.addEventListener('click', function (event) {
    if (panel.hidden) return;
    if (!panel.contains(event.target) && event.target !== toggle) {
      closePanel();
    }
  });

  var debounceTimer;
  input.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    var query = input.value.trim();

    if (query.length < 2) {
      resultsWrapper.hidden = true;
      resultsWrapper.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(function () {
      var url = baseUrl + '?q=' + encodeURIComponent(query) + '&resources[type]=product,page,article&section_id=predictive-search';

      fetch(url)
        .then(function (response) { return response.text(); })
        .then(function (html) {
          var parsed = new DOMParser().parseFromString(html, 'text/html');
          var fetched = parsed.getElementById('predictive-search-results');
          if (fetched) {
            resultsWrapper.innerHTML = fetched.innerHTML;
            resultsWrapper.hidden = false;
          }
        })
        .catch(function () {});
    }, 250);
  });
});
