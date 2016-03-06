window.jQuery = window.$ =  require('jquery/dist/jquery.min');

import './css/main.css';

import ReactDOM from 'react-dom';
import React from 'react';

import Container from './js/mainContainer';

ReactDOM.render(<Container />, document.getElementById('content'));