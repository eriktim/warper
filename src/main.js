import 'bootstrap';

import {Firebase} from 'persistence-plugin-firebase';

export let firebase = new Firebase({
  apiKey: 'AIzaSyC373ylG9TII68H3Xua_nS2dVI0ihaCgZs',
  authDomain: 'warper.firebaseapp.com',
  databaseURL: 'https://warper.firebaseio.com',
  storageBucket: 'project-313180311630044673.appspot.com'
});

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('persistence', baseConfig => {
      baseConfig.plugin(firebase)
                .configure();
    });

  aurelia.start().then(() => aurelia.setRoot());
}
