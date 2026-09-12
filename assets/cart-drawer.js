document.addEventListener('DOMContentLoaded', function () {
  var drawer = document.getElementById('CartDrawer');
  var trigger = document.querySelector('[data-cart-drawer-trigger]');
  if (!drawer) return;

  function openDrawer() {
    drawer.removeAttribute('hidden');
    document.body.classList.add('cart-drawer-open');
    requestAnimationFrame(function () {
      drawer.classList.add('is-open');
    });
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    document.body.classList.remove('cart-drawer-open');
    window.setTimeout(function () {
      drawer.setAttribute('hidden', '');
    }, 300);
  }

  if (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      openDrawer();
    });
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-cart-drawer-close]')) {
      event.preventDefault();
      closeDrawer();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && document.body.classList.contains('cart-drawer-open')) {
      closeDrawer();
    }
  });

  function swapSection(html, targetId) {
    if (!html) return;
    var fresh = new DOMParser().parseFromString(html, 'text/html').getElementById(targetId);
    var current = document.getElementById(targetId);
    if (fresh && current) current.replaceWith(fresh);
  }

  function applySections(sections) {
    if (!sections) return;
    swapSection(sections['cart-drawer'], 'CartDrawer');
    swapSection(sections['cart-icon-bubble'], 'CartIconBubble');
    drawer = document.getElementById('CartDrawer');
  }

  document.addEventListener('cart:updated', function (event) {
    applySections(event.detail && event.detail.sections);
    openDrawer();
  });

  document.addEventListener('click', function (event) {
    var removeBtn = event.target.closest('[data-cart-drawer-remove]');
    var decreaseBtn = event.target.closest('[data-cart-drawer-decrease]');
    var increaseBtn = event.target.closest('[data-cart-drawer-increase]');
    if (!removeBtn && !decreaseBtn && !increaseBtn) return;

    var item = event.target.closest('[data-cart-drawer-item]');
    if (!item) return;

    var quantity;
    if (removeBtn) {
      quantity = 0;
    } else {
      var current = parseInt(item.querySelector('[data-cart-drawer-qty]').textContent, 10) || 0;
      quantity = decreaseBtn ? Math.max(0, current - 1) : current + 1;
    }

    fetch(drawer.getAttribute('data-cart-change-url'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        id: item.getAttribute('data-line-key'),
        quantity: quantity,
        sections: 'cart-drawer,cart-icon-bubble'
      })
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        applySections(data.sections);
        openDrawer();
      });
  });
});
