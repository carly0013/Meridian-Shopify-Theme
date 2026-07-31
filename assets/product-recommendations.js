document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-product-recommendations]').forEach(function (container) {
    var url = container.getAttribute('data-url');
    if (!url) return;

    fetch(url)
      .then(function (response) { return response.text(); })
      .then(function (html) {
        var parsed = new DOMParser().parseFromString(html, 'text/html');
        var fetched = parsed.querySelector('[data-product-recommendations]');
        if (fetched && fetched.innerHTML.trim() !== '') {
          container.innerHTML = fetched.innerHTML;
        } else {
          container.remove();
        }
      })
      .catch(function () {
        container.remove();
      });
  });
});
