import 'bootstrap';

import firebase from 'persistence-plugin-firebase';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('persistence', baseConfig => {
      baseConfig.configure(firebase({
        apiKey: 'AIzaSyC373ylG9TII68H3Xua_nS2dVI0ihaCgZs',
        authDomain: 'warper.firebaseapp.com',
        databaseURL: 'https://warper.firebaseio.com',
        storageBucket: 'project-313180311630044673.appspot.com'
      }));
    });

  aurelia.start().then(() => aurelia.setRoot());
}
