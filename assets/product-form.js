document.addEventListener('DOMContentLoaded', function () {
  var root = document.querySelector('[data-product-root]');
  if (!root) return;

  var variantJson = root.querySelector('[data-product-json]');
  var variants = variantJson ? JSON.parse(variantJson.textContent) : [];

  var variantInput = root.querySelector('[data-variant-id]');
  var priceEl = root.querySelector('[data-product-price]');
  var unitPriceEl = root.querySelector('[data-unit-price]');
  var paymentTerms = root.querySelector('[data-shopify-payment-terms]');
  var submitBtn = root.querySelector('[data-add-to-cart]');
  var optionFieldsets = root.querySelectorAll('[data-option-index]');
  var mainImage = root.querySelector('[data-gallery-main-image]');
  var thumbs = root.querySelectorAll('[data-gallery-thumb]');

  function getSelectedOptions() {
    var values = [];
    optionFieldsets.forEach(function (fieldset) {
      var checked = fieldset.querySelector('[data-option-input]:checked');
      values.push(checked ? checked.value : null);
    });
    return values;
  }

  function findVariant(values) {
    return variants.find(function (variant) {
      return values.every(function (value, index) {
        return variant['option' + (index + 1)] === value;
      });
    });
  }

  function setActiveMedia(mediaId) {
    if (!mainImage) return;
    var thumb = null;
    thumbs.forEach(function (t) {
      var isMatch = t.getAttribute('data-media-id') === String(mediaId);
      t.classList.toggle('is-active', isMatch);
      if (isMatch) thumb = t;
    });
    if (thumb) {
      mainImage.src = thumb.getAttribute('data-full-src');
      mainImage.srcset = thumb.getAttribute('data-full-srcset');
      mainImage.alt = thumb.getAttribute('data-alt') || '';
    }
  }

  function updateSubmitState(variant) {
    if (!submitBtn) return;
    if (!variant) {
      submitBtn.disabled = true;
      submitBtn.textContent = submitBtn.getAttribute('data-label-unavailable');
      return;
    }
    if (variant.available) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.getAttribute('data-label-add');
    } else {
      submitBtn.disabled = true;
      submitBtn.textContent = submitBtn.getAttribute('data-label-sold-out');
    }
  }

  function updatePrice(variant) {
    if (!priceEl || !variant) return;
    var template = root.querySelector('[data-price-template][data-variant-id="' + variant.id + '"]');
    if (template) priceEl.innerHTML = template.innerHTML;
  }

  function updateUnitPrice(variant) {
    if (!unitPriceEl || !variant) return;
    var template = root.querySelector('[data-unit-price-template][data-variant-id="' + variant.id + '"]');
    if (template) {
      unitPriceEl.innerHTML = template.innerHTML;
      unitPriceEl.hidden = false;
    } else {
      unitPriceEl.hidden = true;
    }
  }

  function updatePaymentTerms(variant) {
    if (!paymentTerms || !variant) return;
    paymentTerms.setAttribute('variant-id', variant.id);
  }

  function updateUrl(variant) {
    if (!variant || !window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url);
  }

  function onOptionChange() {
    var values = getSelectedOptions();
    var variant = findVariant(values);

    updateSubmitState(variant);

    if (!variant) return;

    if (variantInput) variantInput.value = variant.id;
    updatePrice(variant);
    updateUnitPrice(variant);
    updatePaymentTerms(variant);
    updateUrl(variant);
    if (variant.featured_media) setActiveMedia(variant.featured_media.id);
  }

  optionFieldsets.forEach(function (fieldset) {
    fieldset.querySelectorAll('[data-option-input]').forEach(function (input) {
      input.addEventListener('change', onOptionChange);
    });
  });

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      setActiveMedia(thumb.getAttribute('data-media-id'));
    });
  });

  var quantityInput = root.querySelector('[data-quantity-input]');
  var decreaseBtn = root.querySelector('[data-quantity-decrease]');
  var increaseBtn = root.querySelector('[data-quantity-increase]');

  if (quantityInput && decreaseBtn && increaseBtn) {
    decreaseBtn.addEventListener('click', function () {
      var min = parseInt(quantityInput.min, 10) || 1;
      var value = Math.max(min, (parseInt(quantityInput.value, 10) || min) - 1);
      quantityInput.value = value;
    });
    increaseBtn.addEventListener('click', function () {
      var min = parseInt(quantityInput.min, 10) || 1;
      var value = Math.max(min, (parseInt(quantityInput.value, 10) || min) + 1);
      quantityInput.value = value;
    });
  }
});
