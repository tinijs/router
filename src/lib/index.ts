import {Router, Route, RouterOptions} from '@vaadin/router';

export function registerRoutes(
  outlet: HTMLElement,
  routes: Route[],
  options?: RouterOptions
) {
  const router = new Router(outlet, options);
  router.setRoutes(routes);
  return router;
}

export {Router, Route};
