
import HomePage from '../pages/home.f7.html';
import AboutPage from '../pages/about.f7.html';
import FormPage from '../pages/form.f7.html';
import RenewSerial from '../pages/renew.f7.html';


import DynamicRoutePage from '../pages/dynamic-route.f7.html';
import RequestAndLoad from '../pages/request-and-load.f7.html';
import NotFoundPage from '../pages/404.f7.html';

//const stripe = require('stripe')('sk_test_51H4VvJCjecf2D9fjreTnLzKeeDOBF3oUkcWdXBRPHLkHaPHdGNMSdDJAhX7unCXd1hk20C8oDAipLuz6pxjKwX7s00hYju7MPA');

var routes = [
 

  {
    path: '/',
    async: function (routeTo, routeFrom, resolve, reject) {
      var router = this;
      // App instance
      var app = router.app;
      app.preloader.show();
      var api = app.data.api;

      /*const session = stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Carl and the Plague',
            },
            unit_amount: 50,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://wetheforcestudios.com/carlandtheplague/success/{CHECKOUT_SESSION_ID}',
        cancel_url: 'https://wetheforcestudios.com/carlandtheplague/cancel',
      });
*/

      app.request.json(app.data.api+'/items/stripekeys/1', function (res) {
        app.preloader.hide();
          resolve(
          // How and what to load: template
            {
              component: HomePage
            },
          // Custom template context
            {
              context: {
                data: res.data,
                //session: session.id
              },
            }
          );
      });
    }
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },


  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/renew/:serial',
    async: function(routeTo, routeFrom, resolve, reject){
      var router = this;
      // App instance
      var app = router.app;

      // App get serial number 
      var serial = routeTo.params.serial;
      console.log(serial);
      // Show Preloader
      app.preloader.show();
      var api = app.data.api;

      app.request.json(app.data.api+'/items/licenses/'+serial, function (res) {
        if(app.methods.isEmpty(res.data)){
          console.log('yes');
        } else {
          console.log('no');
        }
        console.log(res.data);
      app.preloader.hide();

        resolve(
         // How and what to load: template
          {
            component: RenewSerial
          },
         // Custom template context
          {
            context: {
              data: res.data,
            },
          }
        );
      });
    },
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: HomePage,
  },
];

export default routes;