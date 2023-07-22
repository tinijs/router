/* eslint-disable @typescript-eslint/no-explicit-any */
import {GLOBAL, registerGlobalHook, ComponentTypes, LifecycleHooks} from '@tinijs/core';
import {Route, RouterOptions} from './types';
import {hideNavIndicator, showNavIndicator} from './methods';
import {TiniRouter} from './router';

export function createRouter(routes: Route[], options: RouterOptions = {}) {
  const router = new TiniRouter(routes, options).init();
  // handle nav indicator
  if (GLOBAL.$tiniAppOptions?.navIndicator) {
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
      if (url.pathname === location.pathname) return;
      router.indicatorSchedule = setTimeout(() => showNavIndicator(), 500);
    });
  }
  // result
  return router;
}
