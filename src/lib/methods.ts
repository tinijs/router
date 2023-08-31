import {getAppInstance, TiniApp, Global} from '@tinijs/core';

import {NavIndicatorComponent, ActivatedRoute} from './types';
import {NAV_INDICATOR_ID, NAV_INDICATOR, CLASS_ACTIVE} from './consts';
import {Router} from './router';

export function getRouter(): null | Router {
  const appOrGlobal = getAppInstance(true);
  return (
    (appOrGlobal as TiniApp).$router ||
    (appOrGlobal as Global).$tiniRouter ||
    null
  );
}

export function getActiveRoute(): ActivatedRoute | undefined {
  return getRouter()?.getActiveRoute();
}

export function getParams() {
  return getRouter()?.getParams();
}

export function requestChange() {
  return window.dispatchEvent(new PopStateEvent('popstate'));
}

export function go(to: string, replace?: boolean) {
  const url = new URL(to, window.location.origin);
  if (url.href === window.location.href) return;
  window.history[!replace ? 'pushState' : 'replaceState']({}, '', url.href);
  return requestChange();
}

export function redirect(to: string) {
  return go(to, true);
}

export function back() {
  window.history.back();
  return requestChange();
}

export function forward() {
  window.history.forward();
  return requestChange();
}

export function getNavIndicator() {
  const app = getAppInstance();
  if (!app) return null;
  const root = (app as TiniApp).renderRoot;
  return (
    root.querySelector(NAV_INDICATOR) ||
    root.querySelector(`#${NAV_INDICATOR_ID}`)
  );
}

export function showNavIndicator() {
  const node = getNavIndicator() as NavIndicatorComponent;
  if (!node) return;
  if (node.show instanceof Function) {
    node.show();
  } else {
    node.classList.add(CLASS_ACTIVE);
  }
}

export function hideNavIndicator() {
  const node = getNavIndicator() as NavIndicatorComponent;
  if (!node) return;
  if (node.hide instanceof Function) {
    node.hide();
  } else {
    node.classList.remove(CLASS_ACTIVE);
  }
}
