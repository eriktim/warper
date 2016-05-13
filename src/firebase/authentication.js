import {inject, LogManager} from 'aurelia-framework';
import {Firebase} from './firebase';

@inject(Firebase)
export class AuthenticationService {
  firebase;
  logger;

  constructor(firebase) {
    this.logger = LogManager.getLogger('AuthenticationService');
    this.firebase = firebase;
  }

  isLoggedIn() {
    return !!this.firebase.native.getAuth();
  }

  login(email, password) {
    this.logger.debug('trying to login...');
    return new Promise((resolve, reject) => {
      this.firebase.native.authWithPassword({email, password}, (err, auth) => {
        if (err) {
          let msg = 'authentication failed';
          this.logger.debug(msg);
          reject(msg);
          return;
        }
        this.logger.debug('user logged in successfully', auth);
        resolve();
      });
    });
  }

  logout() {
    return this.firebase.native.unauth()
      .then(() => this.logger.debug('user logged out successfully'));
  }
}
