import {Key} from 'path-to-regexp';

import {Router} from './router';

export interface Route {
  title?: string;
  path: string;
  component: string;
  action?: () => Promise<unknown>;
  children?: Omit<Route, 'children'>[];
}

export interface RegistryItem {
  page: Route;
  layout?: Route;
  regexp?: RegExp;
}

export interface RouterOptions {
  linkTrigger?: boolean;
}

export interface MatchResult {
  url: URL;
  path: string;
  routePath?: string;
  regexp?: RegExp;
  keys?: Key[];
  params?: Record<string, any>;
  pageRoute?: Route;
  layoutRoute?: Route;
}

export type ActivatedRoute = MatchResult;

export interface NavIndicatorComponent extends HTMLElement {
  show?(): void;
  hide?(): void;
}

export type RouteCommand = () => void;

export type RouteHookResult =
  | void
  | null
  | string
  | RouteCommand
  | Promise<void | null | string | RouteCommand>;

export type RouteHook = (
  router: Router,
  activeRoute: MatchResult,
  newEl: HTMLElement,
  currentEl: null | HTMLElement
) => RouteHookResult;

export type ElemHook = undefined | RouteHook;

export interface OnBeforeLeave {
  onBeforeLeave: RouteHook;
}

export interface OnBeforeEnter {
  onBeforeEnter: RouteHook;
}

export interface OnAfterEnter {
  onAfterEnter: RouteHook;
}

export interface OnAfterLeave {
  onAfterLeave: RouteHook;
}
