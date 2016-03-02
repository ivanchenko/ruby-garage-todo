'use strict';

import $ from 'jquery';
import {setCookie} from './helpers/cookie';

var formLogin = document.getElementById('form-login');
var formSignUp = document.getElementById('form-sign-up');

formLogin.addEventListener('submit', function (e) {
  e.preventDefault();
  var loginUsername = document.getElementById('login-username');
  var loginPassword = document.getElementById('login-password');

  var name = loginUsername.value.trim();
  var pass = loginPassword.value;

  if (name && pass) {
    $.ajax({
      type: 'POST',
      url: '/login',
      data: {
        type: 'login',
        username: name,
        password: pass
      }
    }).done((data) => {
      setCookie('userId', data.userId);
      window.location.href = '/main';
    }).fail(() => {
      $('<div class="alert alert-danger auth-error">' +
        'Oops, something is wrong<br>Check your username and password </div>').insertBefore(formLogin);
    });
  } else {
    $('<div class="alert alert-danger auth-error">' +
      'Oops, something is wrong<br>Check your username and password </div>').insertBefore(formLogin);
  }
});

formSignUp.addEventListener('submit', function (e) {
  e.preventDefault();
  var signUpUsername = document.getElementById('sign-up-username');
  var signUpPassword = document.getElementById('sign-up-password');
  var signUpRepeatPassword = document.getElementById('sign-up-repeat-password');

  var name = signUpUsername.value.trim();
  var pass = signUpPassword.value;
  var repeatedPass = signUpRepeatPassword.value;

  if (pass !== repeatedPass) {
    $('<div class="alert alert-danger auth-error">' +
      'Oops, something is wrong<br>Check your username and password </div>').insertBefore(formSignUp);
    return;
  }

  if (name && pass) {
    $.ajax({
      type: 'POST',
      url: '/login',
      data: {
        type: 'signup',
        username: name,
        password: pass
      }
    }).done((data) => {
      setCookie('userId', data.userId);
      window.location.href = '/main';
    }).fail(() => {
       $('<div class="alert alert-danger auth-error">' +
         'Oops, something is wrong<br>Check your username and password </div>').insertBefore(formSignUp);
    });
  }
});
