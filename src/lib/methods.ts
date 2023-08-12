import {getAppInstance, TiniApp, Global} from '@tinijs/core';

import {NavIndicatorComponent} from './types';
import {NAV_INDICATOR_ID, NAV_INDICATOR, CLASS_ACTIVE} from './consts';
import {TiniRouter} from './router';

export function getRouter(): null | TiniRouter {
  const appOrGlobal = getAppInstance(true);
  return (
    (appOrGlobal as TiniApp).$router ||
    (appOrGlobal as Global).$tiniRouter ||
    null
  );
}

export function go(to: string) {
  const url = new URL(to, window.location.origin);
  if (url.href !== window.location.href) {
    history.pushState({}, '', url.href);
    dispatchEvent(new PopStateEvent('popstate'));
  }
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
