
import HomePage from '../pages/home.f7.html';
import AboutPage from '../pages/about.f7.html';
import FormPage from '../pages/form.f7.html';
import RenewSerial from '../pages/renew.f7.html';


import DynamicRoutePage from '../pages/dynamic-route.f7.html';
import RequestAndLoad from '../pages/request-and-load.f7.html';
import NotFoundPage from '../pages/404.f7.html';

var routes = [
  {
    path: '/',
    component: HomePage,
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