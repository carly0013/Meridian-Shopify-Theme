document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('CartForm');
  if (!form) return;

  function submitForm() {
    if (form.requestSubmit) {
      form.requestSubmit();
    } else {
      form.submit();
    }
  }

  form.querySelectorAll('[data-quantity-input]').forEach(function (input) {
    input.addEventListener('change', submitForm);
  });

  form.querySelectorAll('[data-quantity-decrease]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.parentElement.querySelector('[data-quantity-input]');
      var value = Math.max(0, (parseInt(input.value, 10) || 0) - 1);
      input.value = value;
      submitForm();
    });
  });

  form.querySelectorAll('[data-quantity-increase]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.parentElement.querySelector('[data-quantity-input]');
      var value = (parseInt(input.value, 10) || 0) + 1;
      input.value = value;
      submitForm();
    });
  });
});
