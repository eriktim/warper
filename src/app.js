import {inject} from 'aurelia-framework';
import {AuthenticationService} from './firebase/authentication';

@inject(AuthenticationService)
export class App {
  constructor(authenticationService) {
window.authenticationService = authenticationService;
    Promise.resolve()
      .then(() => {
        if (!authenticationService.isLoggedIn()) {
          return authenticationService.login('e.timmers@gmail.com', 'test');
        }
      });
  }

  configureRouter(config, router) {
    config.title = 'Warper';
    config.map([
      { route: ['', 'editor'], name: 'editor',      moduleId: './component/editor',      nav: true, title: 'Editor' }
    ]);

    this.router = router;
  }
}
