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
    stripeSK: 'sk_test_51H4VvJCjecf2D9fjreTnLzKeeDOBF3oUkcWdXBRPHLkHaPHdGNMSdDJAhX7unCXd1hk20C8oDAipLuz6pxjKwX7s00hYju7MPA',
    stripeTK: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
    stripeUrl: 'https://api.stripe.com/v1/checkout/sessions',
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
      pushState: true,
      pushStateRoot: 'https://carlpayment.netlify.app/',
      pushStateSeparator: ''
  },


  // App routes
  routes: routes,

});


// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
