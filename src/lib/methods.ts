import {NavIndicatorComponent, ActivatedRoute} from './types';
import {
  GLOBAL_TINI,
  TINI_APP_CONTEXT,
  NAV_INDICATOR_ID,
  NAV_INDICATOR,
  CLASS_ACTIVE,
  NO_ROUTER_ERROR,
} from './consts';

export function getRouter() {
  if (!TINI_APP_CONTEXT.router) throw new Error(NO_ROUTER_ERROR);
  return TINI_APP_CONTEXT.router;
}

export function getActiveRoute(): ActivatedRoute | undefined {
  return getRouter().getActiveRoute();
}

export function getParams() {
  return getRouter().getParams();
}

export function requestChange() {
  return dispatchEvent(new PopStateEvent('popstate'));
}

export function go(to: string, replace?: boolean) {
  const url = new URL(to, location.origin);
  if (url.href === location.href) return;
  history[!replace ? 'pushState' : 'replaceState']({}, '', url.href);
  return requestChange();
}

export function redirect(to: string) {
  return go(to, true);
}

export function back() {
  history.back();
  return requestChange();
}

export function forward() {
  history.forward();
  return requestChange();
}

export function getNavIndicator() {
  if (!GLOBAL_TINI.app) return null;
  const root = GLOBAL_TINI.app.renderRoot;
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
