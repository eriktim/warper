import 'firebase';

const config = {
  apiKey: 'AIzaSyC373ylG9TII68H3Xua_nS2dVI0ihaCgZs',
  authDomain: 'warper.firebaseapp.com',
  databaseURL: 'https://warper.firebaseio.com',
  storageBucket: 'project-313180311630044673.appspot.com'
};

export class Firebase {
  native;
  url;

  constructor() {
    this.url = config.databaseURL;
    this.native = firebase;
    this.native.initializeApp(config);
  }
}
