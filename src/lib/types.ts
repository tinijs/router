export interface Route {
  title?: string;
  path: string;
  component: string;
  action?: () => Promise<unknown>;
  children?: Omit<Route, 'children'>[];
}

export interface RouterOptions {
  linkTrigger?: boolean;
}

export interface MatchResult {
  url: URL;
  pageRoute?: Route;
  layoutRoute?: Route;
}

export interface NavIndicatorComponent extends HTMLElement {
  show?(): void;
  hide?(): void;
}
