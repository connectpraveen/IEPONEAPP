// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
     firebase: {
       apiKey: "AIzaSyAKHPsBEzz8htoyoA2XIreHR6MSLVmEoYs",
       authDomain: "platform-1519020568982.firebaseapp.com",
       databaseURL: "https://platform-1519020568982.firebaseio.com",
       projectId: "platform-1519020568982",
       storageBucket: "platform-1519020568982.appspot.com",
       messagingSenderId: "6655461869"
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
