// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBbIOnB0nEHwOkJtVLlRxer_o7mP76Lr3M",
    authDomain: "iepone-qa-account-web.firebaseapp.com",
    databaseURL: "https://iepone-qa-account-web.firebaseio.com",
    projectId: "iepone-qa-account-web",
    storageBucket: "iepone-qa-account-web.appspot.com",
    messagingSenderId: "1079467976224"
 },
 clientVerifyURL:'http://localhost:4200/',
 serverMailerURL:'http://localhost:8080/',
 servletUrl: 'https://iepone-qa-account-server.appspot.com/',
 localservletUrl: 'https://iepone-qa-account-server.appspot.com/',
 clientTokenURL:'https://iepone-qa-account-payserver.appspot.com/client_token',
 createPurchaseURL:'https://iepone-qa-account-payserver.appspot.com/checkout',
 clientTokenURL_Local:'http://localhost:8080/client_token',
 createPurchaseURL_Local:'http://localhost:8080/checkout'
};
