/* eslint-disable @typescript-eslint/no-explicit-any */
import {ComponentTypes, LifecycleHooks, registerGlobalHook} from '@tinijs/core';

import {TINI_APP_CONTEXT, ROUTE_CHANGE_EVENT} from './consts';
import {Route, RouterOptions} from './types';
import {hideNavIndicator, showNavIndicator} from './methods';
import {Router} from './router';

export function createRouter(routes: Route[], options: RouterOptions = {}) {
  const router = new Router(routes, options).init();
  // handle nav indicator
  if (TINI_APP_CONTEXT.options?.navIndicator) {
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
    addEventListener(ROUTE_CHANGE_EVENT, e => {
      const {url} = (e as CustomEvent).detail;
      if (url.pathname === location.pathname) return;
      router.indicatorSchedule = setTimeout(
        () => showNavIndicator(),
        500
      ) as unknown as number;
    });
  }
  // result
  return (TINI_APP_CONTEXT.router = router);
}
