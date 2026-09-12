document.addEventListener('DOMContentLoaded', function () {
  var cartAddUrl = document.body.getAttribute('data-cart-add-url');
  if (!cartAddUrl || !window.fetch) return;

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-quick-add]');
    if (!button) return;

    var link = button.getAttribute('data-quick-add-link');
    if (link) {
      window.location.href = link;
      return;
    }

    var originalText = button.textContent;
    button.disabled = true;

    fetch(cartAddUrl + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        id: button.getAttribute('data-variant-id'),
        quantity: 1,
        sections: 'cart-drawer,cart-icon-bubble'
      })
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data.status) {
          button.textContent = data.description || data.message;
          window.setTimeout(function () { button.textContent = originalText; }, 2500);
          return;
        }
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));
      })
      .finally(function () {
        button.disabled = false;
      });
  });
});
