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
            // TODO auth function
            let [path, ...params] = request.url.split('?');
            let url = `${path}.json?auth=${[token, params.join('?')].join('&')}`;
            let init = {};
            ['method', 'headers', 'body', 'mode', 'credentials',
              'cache', 'redirect', 'referrer', 'integrity']
                .forEach(prop => init[prop] = request[prop]);
            return new Request(url, init);
          });
        }
      });
    });

  aurelia.start().then(() => aurelia.setRoot());
}
