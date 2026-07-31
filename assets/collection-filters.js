document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.collection-filters').forEach(function (form) {
    form.querySelectorAll('.collection-filters__options input[type="checkbox"]').forEach(function (input) {
      input.addEventListener('change', function () {
        form.submit();
      });
    });
  });
});
