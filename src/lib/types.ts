export interface NavIndicatorComponent extends HTMLElement {
  show?(): void;
  hide?(): void;
}

export interface ContextLite {
  pathname: string;
  search: null | string;
  hash: null | string;
}
