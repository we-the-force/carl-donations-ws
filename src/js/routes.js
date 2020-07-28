
import HomePage from '../pages/home.f7.html';
import DownloadPage from '../pages/download.f7.html';
import AboutPage from '../pages/about.f7.html';
import FormPage from '../pages/form.f7.html';
import RenewSerial from '../pages/renew.f7.html';


import DynamicRoutePage from '../pages/dynamic-route.f7.html';
import RequestAndLoad from '../pages/request-and-load.f7.html';
import NotFoundPage from '../pages/404.f7.html';

//const stripe = require('stripe')('sk_test_51H4VvJCjecf2D9fjreTnLzKeeDOBF3oUkcWdXBRPHLkHaPHdGNMSdDJAhX7unCXd1hk20C8oDAipLuz6pxjKwX7s00hYju7MPA');

var routes = [
  {
    path: '/download',
    component: DownloadPage
  },
 {

   path: '/payment/:sessionId',
   async: function (routeTo, routeFrom, resolve, reject) {

    var router = this;
    var app = router.app;
    app.preloader.show();

    var stripeUrl = app.data.stripeUrl;
    var paymentUrl = app.data.paymentUrl;
    var sessionId = routeTo.params.sessionId;

    app.request.setup({
      headers: {
        'Authorization': 'Bearer '+app.data.stripeSK,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    app.request.json(stripeUrl+'/'+sessionId, function (res) {
        app.preloader.hide();
        console.log(res);
        console.log(res.payment_intent);
        var paymentIntent = res.payment_intent;

        app.request.get(paymentUrl+'/'+paymentIntent, function(paymentRes) {
          var paymentData = JSON.parse(paymentRes);
          
          if(paymentData.charges.data[0].paid)
          {
            var payment_email = paymentData.charges.data[0].billing_details.email;
            
            //--- Aqui ya tiene la info necesaria para dar de alta la informacion en la base de datos
            var paymentData = {
              status: 'confirmed',
              payment_intent: paymentIntent
            };

            app.request.post(app.data.api+'/items/payment_info', paymentData, function(dbPaymentResponse) {
              dbPaymentResponse = JSON.parse(dbPaymentResponse);
              console.log(dbPaymentResponse);

              var payment_newId = dbPaymentResponse.data.id;
              //--- TEMPORALMENTE UTILZIARE EL TIME AL ESTILO UNIX PARA GENERAL UN SERIAL UNICO

              var serial_license;
              app.methods.serialGen().then(function(res){
                serial_license = res;

                console.log(serial_license);
                /* 
                 var serial_license = Math.floor(new Date() / 1000);
                 console.log('Serial_Licence: ' + serial_license);*/
   
                 var licenseData = {
                   active: 1,
                   serial: serial_license
                 };
   
                 app.request.post(app.data.api+'/items/licenses', licenseData, function(dbLicenseResponse) {
                   //--- finalmente armamos al cliente con los ids relacionados de licencia y pago
                   dbLicenseResponse = JSON.parse(dbLicenseResponse);
                   console.log(dbLicenseResponse);
   
                   var serial = dbLicenseResponse.data.serial;
   
                   var clientData = {
                     email: payment_email,
                     payment: payment_newId,
                     license: serial,
                     active: 1
                   };
                   app.request.post(app.data.api+'/items/clients', clientData, function(dbClientResponse){
                     dbClientResponse = JSON.parse(dbClientResponse);
                     console.log(dbClientResponse);
   
                     //--- ya se han generado todos los datos en la base de datos, ahora debe enviar el correo al usuario, y avisar en la pagina que ya esta todo OK

                     var auth_data = {
                        "email" : "will@wetheforce.com",
                        "password" : "p4r4n64r1"
                     };

                     app.request.post(app.data.api + '/auth/authenticate', auth_data, function(auth_res) {
                        var auth_res_data = JSON.parse(auth_res);

                        console.log(auth_res_data);

                        app.request.setup({
                          headers: {
                            'Authorization': 'Bearer '+ auth_res_data.data.token,
                            'Content-Type': 'application/json'
                          }
                        });

                        var email_data = {
                          "to": [
                            payment_email
                          ],
                          "subject": "Carl & the Plague",
                          "body": "Gracias por adquirir el juego de <b>Carl & the Plague</b><br><br>Para instalar su copia del juego, descarguelo en esta direccion <a href:'{{direccion}}'>{{direccion}}</a><br><br>su numero de serie es<br><br><b>{{serial}}</b>",
                          "type": "html",
                          "data": {
                            "serial": serial_license,
                            "direccion": "https://carl.wetheforce.com/#!/download"
                          }
                        };
      
                        app.request.Authorization


                        app.request.post(app.data.api+'/mail', email_data, function(mail_response){
                          //--- aqui mostrar la cosa de que ya se envio el correo y asi
                          console.log("mail sent " );
                          console.log(mail_response);
                          app.dialog.alert('Te enviamos un correo con tu número de serie y el link de descarga.', 'Gracias!!!');
                        });                        

                     });
                   });
                 });
              });
            });
          }

          resolve(
            // How and what to load: template
              {
                component: HomePage
              },
            // Custom template context
              {
                context: {
                  //session: session.id
                },
              }
            );          

        });
    });
   }
 },

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