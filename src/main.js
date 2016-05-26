import 'bootstrap';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('persistence', baseConfig => {
      baseConfig.configure({
        baseUrl: 'https://warper.firebaseio.com',
        requestInterceptor: request => {
          return window.authenticationService.getToken().then(token => {
            //params.auth = token;
            console.log(request.url);
            let parts = request.url.split('?');
            let url = parts[0] + '.json?' + parts.slice(1);
            console.log(url);
          });
        }
      });
    });

  aurelia.start().then(() => aurelia.setRoot());
}
