import {inject} from 'aurelia-framework';
import {AuthenticationService} from 'aurelia-firebase';

@inject(AuthenticationService)
export class App {
  constructor(authenticationService) {
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
