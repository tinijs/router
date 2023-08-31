/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GLOBAL,
  Global,
  ComponentTypes,
  LifecycleHooks,
  registerGlobalHook,
} from '@tinijs/core';
import {Route, RouterOptions} from './types';
import {hideNavIndicator, showNavIndicator} from './methods';
import {Router} from './router';

export function createRouter(routes: Route[], options: RouterOptions = {}) {
  const router = new Router(routes, options).init();
  // handle nav indicator
  if ((GLOBAL as Global).$tiniAppOptions?.navIndicator) {
    router.indicatorSchedule = null;
    // exit
    registerGlobalHook(
      ComponentTypes.Page,
      LifecycleHooks.OnChildrenReady,
      () => {
        if (router.indicatorSchedule === null) return;
        hideNavIndicator();
        // cancel schedule (if scheduled)
        clearTimeout(router.indicatorSchedule);
        router.indicatorSchedule = null;
      }
    );
    // entry
    window.addEventListener('route', e => {
      const {url} = (e as CustomEvent).detail;
      if (url.pathname === window.location.pathname) return;
      router.indicatorSchedule = setTimeout(() => showNavIndicator(), 500);
    });
  }
  // result
  return router;
}
