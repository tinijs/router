/* eslint-disable @typescript-eslint/no-explicit-any */
import {Router, Route} from '@vaadin/router';
import {
  GLOBAL,
  ROUTER_OUTLET_ID,
  getAppInstance,
  TiniApp,
  COMPONENT_TYPES,
  LIFECYCLE_HOOKS,
  registerGlobalHook,
} from '@tinijs/core';
import {isCurrentRoute, showNavIndicator, hideNavIndicator} from './methods';

export function registerRoutes(routes: Route[]) {
  const app = getAppInstance() as TiniApp;
  const router = new Router(
    app.renderRoot.querySelector(`#${ROUTER_OUTLET_ID}`)
  ) as any;
  router.setRoutes(routes);
  // handle nav indicator
  if (GLOBAL.$tiniAppOptions?.navIndicator) {
    router._indicatorSchedule = null;
    // exit
    registerGlobalHook(
      COMPONENT_TYPES.PAGE,
      LIFECYCLE_HOOKS.ON_CHILDREN_READY,
      () => {
        if (router._indicatorSchedule === null) return;
        hideNavIndicator();
        // cancel schedule (if scheduled)
        clearTimeout(router._indicatorSchedule);
        router._indicatorSchedule = null;
      }
    );
    // entry
    window.addEventListener('vaadin-router-go', (e: any) => {
      if (isCurrentRoute(router, (e as CustomEvent).detail)) return;
      router._indicatorSchedule = setTimeout(() => showNavIndicator(), 500);
    });
  }
  // result
  return router as Router;
}
