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
 }

  /*firebase: {
    apiKey: "AIzaSyBi9GItI8XWcXEX54dgmH2SKQsDWyZLdoA",
    authDomain: "angularjs-demo-11570.firebaseapp.com",
    databaseURL: "https://angularjs-demo-11570.firebaseio.com",
    projectId: "angularjs-demo-11570",
    storageBucket: "angularjs-demo-11570.appspot.com",
    messagingSenderId: "902914030574"
  }*/
};
