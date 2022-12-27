import {Router, Route} from '@vaadin/router';
import {getAppInstance, ROUTER_OUTLET} from '@tinijs/core';

export function registerRoutes(routes: Route[]) {
  const router = new Router(
    getAppInstance().renderRoot.querySelector(`#${ROUTER_OUTLET}`)
  );
  router.setRoutes(routes);
  return router;
}

export {Router, Route};
