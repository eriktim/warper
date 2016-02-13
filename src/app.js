export class App {
  configureRouter(config, router) {
    config.title = 'Warper';
    config.map([
      { route: ['', 'editor'], name: 'editor',      moduleId: './component/editor',      nav: true, title: 'Editor' }
    ]);

    this.router = router;
  }
}
