document.addEventListener('DOMContentLoaded', function () {
  var loginPanel = document.querySelector('[data-login-panel]');
  var recoverPanel = document.querySelector('[data-recover-panel]');
  var showRecover = document.querySelector('[data-show-recover]');
  var showLogin = document.querySelector('[data-show-login]');

  if (!loginPanel || !recoverPanel) return;

  if (showRecover) {
    showRecover.addEventListener('click', function () {
      loginPanel.hidden = true;
      recoverPanel.hidden = false;
    });
  }

  if (showLogin) {
    showLogin.addEventListener('click', function () {
      recoverPanel.hidden = true;
      loginPanel.hidden = false;
    });
  }

  if (recoverPanel.querySelector('.account-form__errors, .account-form__message--success')) {
    loginPanel.hidden = true;
    recoverPanel.hidden = false;
  }
});
