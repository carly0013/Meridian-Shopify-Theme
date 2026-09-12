document.addEventListener('DOMContentLoaded', function () {
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  var searchToggle = document.querySelector('[data-search-toggle]');
  var searchPanel = document.querySelector('[data-header-search]');
  var searchInput = document.querySelector('[data-predictive-search-input]');
  var searchResults = document.querySelector('[data-predictive-search-results]');

  function setExpanded(toggle, panel, expanded) {
    toggle.setAttribute('aria-expanded', String(expanded));
    if (expanded) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }
  }

  function getFocusable(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')
    );
  }

  if (menuToggle && mobileNav) {
    var trapMobileNav = function (event) {
      if (event.key !== 'Tab') return;
      var focusable = getFocusable(mobileNav);
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    var closeMobileNav = function (restoreFocus) {
      setExpanded(menuToggle, mobileNav, false);
      mobileNav.removeEventListener('keydown', trapMobileNav);
      if (restoreFocus) menuToggle.focus();
    };

    menuToggle.addEventListener('click', function () {
      var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMobileNav(false);
        return;
      }

      if (searchToggle && searchPanel) setExpanded(searchToggle, searchPanel, false);
      setExpanded(menuToggle, mobileNav, true);
      mobileNav.addEventListener('keydown', trapMobileNav);
      var focusable = getFocusable(mobileNav);
      if (focusable.length) focusable[0].focus();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMobileNav(true);
      }
    });
  }

  if (searchToggle && searchPanel && searchInput) {
    searchToggle.addEventListener('click', function () {
      var isOpen = searchToggle.getAttribute('aria-expanded') === 'true';
      if (!isOpen && menuToggle && mobileNav) {
        setExpanded(menuToggle, mobileNav, false);
      }
      setExpanded(searchToggle, searchPanel, !isOpen);
      if (!isOpen) searchInput.focus();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && searchToggle.getAttribute('aria-expanded') === 'true') {
        setExpanded(searchToggle, searchPanel, false);
        searchToggle.focus();
      }
    });
  }

  if (searchInput && searchResults) {
    var predictiveSearchUrl = searchInput.closest('form').getAttribute('data-predictive-search-url');
    var debounceTimer;
    var currentController;

    searchInput.addEventListener('input', function () {
      var query = searchInput.value.trim();
      clearTimeout(debounceTimer);

      if (query.length < 2) {
        searchResults.setAttribute('hidden', '');
        searchResults.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(function () {
        if (currentController) currentController.abort();
        currentController = new AbortController();

        var params = new URLSearchParams({
          q: query,
          'resources[type]': 'product,page,article',
          'resources[limit]': 6,
          'resources[options][unavailable_products]': 'last',
          section_id: 'predictive-search'
        });

        fetch(predictiveSearchUrl + '.json?' + params.toString(), { signal: currentController.signal })
          .then(function (response) { return response.json(); })
          .then(function (data) {
            var html = data && data.sections && data.sections['predictive-search'];
            searchResults.innerHTML = html || '';
            searchResults.removeAttribute('hidden');
          })
          .catch(function (error) {
            if (error.name !== 'AbortError') searchResults.setAttribute('hidden', '');
          });
      }, 200);
    });
  }
});
