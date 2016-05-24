import 'bootstrap';
import {EntityManager} from 'persistence-js';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('persistence-js', baseConfig => {
      baseConfig.configure({
        baseUrl: 'https://warper.firebaseio.com',
        fetchInterceptor: (url, init, params) => {
          return window.authenticationService.getToken().then(token => {
            params.auth = token;
            return `${url}.json`;
          });
        }
      });
    });

  aurelia.start().then(() => aurelia.setRoot());
}
