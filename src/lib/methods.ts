import {Router} from '@vaadin/router';
import {getAppInstance, TiniApp, Global} from '@tinijs/core';
import {NavIndicatorComponent, ContextLite} from './types';
import {NAV_INDICATOR_ID, NAV_INDICATOR, CLASS_ACTIVE} from './consts';

export function isCurrentRoute(router: Router, context: ContextLite) {
  const {
    pathname: currPathname,
    search: currSearch,
    hash: currHash,
  } = (router as any).__previousContext || {};
  const {pathname, search, hash} = context || {};
  return (
    pathname === currPathname && search === currSearch && hash === currHash
  );
}

export function getRouter(): null | Router {
  const appOrGlobal = getAppInstance(true);
  return (
    (appOrGlobal as TiniApp).$router ||
    (appOrGlobal as Global).$tiniRouter ||
    null
  );
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
