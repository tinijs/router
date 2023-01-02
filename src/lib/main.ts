import {Router, Route} from '@vaadin/router';
import {getAppInstance, TiniApp, Global, ROUTER_OUTLET} from '@tinijs/core';

export function registerRoutes(routes: Route[]) {
  const app = getAppInstance() as TiniApp;
  const router = new Router(app.renderRoot.querySelector(`#${ROUTER_OUTLET}`));
  router.setRoutes(routes);
  return router;
}

export function getRouter(): null | Router {
  const appOrGlobal = getAppInstance(true);
  return (
    (appOrGlobal as TiniApp).$router ||
    (appOrGlobal as Global).$tiniRouter ||
    null
  );
}

export {Router, Route};
