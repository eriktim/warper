import {inject, LogManager} from 'aurelia-framework';
import {Firebase} from './firebase';

@inject(Firebase)
export class AuthenticationService {
  firebase;
  logger;
  token;

  constructor(firebase) {
    this.logger = LogManager.getLogger('AuthenticationService');
    this.firebase = firebase;
  }

  getToken() {
    let currentUser = this.firebase.native.auth().currentUser;
    return currentUser ? currentUser.getToken() : Promise.resolve();
  }

  isLoggedIn() {
    return !!this.firebase.native.auth().currentUser;
  }

  login(email, password) {
    this.logger.debug('trying to login...');
    return this.firebase.native.auth().signInWithEmailAndPassword(email, password)
      .then(result => {
        this.logger.debug('user logged in successfully');
        this.token = result['Jf']; // accessToken
      })
      .catch(err => {
        let msg = 'authentication failed';
        this.logger.error(err);
        throw new Error(msg);
      });
  }

  logout() {
    return this.firebase.native.auth().signOut()
      .then(() => this.logger.debug('user logged out successfully'));
  }
}
