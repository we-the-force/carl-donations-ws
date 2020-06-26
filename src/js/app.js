import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.styl';

// Import Routes
import routes from './routes.js';

// Import main app component
import App from '../app.f7.html';

var app = new Framework7({
  root: '#app', // App root element
  component: App, // App main component

  name: 'carl-donations', // App name
  theme: 'auto', // Automatic theme detection

  data: {
    api: 'https://wetheforcestudios.com/api/public/carl-donations'
  },
  methods: {
    serialGen: async () => {
      'use strict';
      var chars = '1234567890',
          serialLength = 6,
          randomSerial = "",
          i,
          randomNumber;
      for (i = 0; i < serialLength; i = i + 1) {
          randomNumber = Math.floor(Math.random() * chars.length);
          randomSerial += chars.substring(randomNumber, randomNumber + 1);
      }
      return randomSerial
    },
    isEmpty: async (obj) => {
      for(var prop in obj) {
          if(obj.hasOwnProperty(prop))
              return false;
      }

      return true;
    }
  },
  view: {
      pushState: true
  },


  // App routes
  routes: routes,
});