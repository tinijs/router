import {Key} from 'path-to-regexp';

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

export interface NavIndicatorComponent extends HTMLElement {
  show?(): void;
  hide?(): void;
}
