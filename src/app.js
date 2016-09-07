import {inject} from 'aurelia-framework';
import {Firebase} from 'aurelia-firebase';

@inject(Firebase)
export class App {
  constructor(firebase) {
    Promise.resolve()
      .then(() => {
        if (!firebase.isSignedIn()) {
          return firebase.signIn('e.timmers@gmail.com', 'test');
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
