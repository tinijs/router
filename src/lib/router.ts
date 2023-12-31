import {pathToRegexp, Key} from 'path-to-regexp';

import {
  Route,
  RouterOptions,
  RegistryItem,
  MatchResult,
  ActivatedRoute,
} from './types';
import {MODULE_ID, ROUTER_OUTLET_TAG_NAME, ROUTE_CHANGE_EVENT} from './consts';
import {go, redirect, back, forward, requestChange} from './methods';
import {RouterOutletComponent} from './router-outlet';

export class Router {
  private readonly NOT_FOUND_PATH = '/**';
  private readonly registry: Record<string, RegistryItem>;
  private readonly cache = new Map<string, MatchResult>();
  private callback?: (result: MatchResult) => void;

  indicatorSchedule: null | number = null;

  constructor(
    public readonly routes: Route[],
    public readonly options: RouterOptions = {}
  ) {
    this.registry = this.buildRegistry(routes);
  }

  init() {
    this.registerOutlet();
    this.registerTriggers();
    return this as Router;
  }

  setCallback(cb: (result: MatchResult) => void) {
    this.callback = cb;
    return this as Router;
  }

  setState(key: string, state: string) {
    sessionStorage.setItem(`${MODULE_ID}:state-${key}`, state);
    return this as Router;
  }

  getState(key: string) {
    return sessionStorage.getItem(`${MODULE_ID}:state-${key}`);
  }

  go(to: string, replace?: boolean) {
    return go(to, replace);
  }

  redirect(to: string) {
    return redirect(to);
  }

  back() {
    return back();
  }

  forward() {
    return forward();
  }

  requestChange() {
    return requestChange();
  }

  getActiveRoute(): ActivatedRoute {
    return this.match(new URL(location.href));
  }

  getParams() {
    return this.getActiveRoute()?.params;
  }

  match(url: URL): MatchResult {
    const path = url.pathname;

    /*
     * 1. check cache
     */
    const cachedResult = this.cache.get(path);
    if (cachedResult) return cachedResult;

    /*
     * 2. check routes
     */
    const pathSegments = path.split('/');
    let matched: undefined | RegistryItem;
    let matchedRoutePath: undefined | string;
    let matchedExecResult: null | RegExpExecArray = null;

    // root
    if (!pathSegments[1] && this.registry['/']) {
      matched = this.registry['/'];
    }
    // exact
    else if (this.registry[path]) {
      matched = this.registry[path];
    }
    // route
    else {
      for (const routePath in this.registry) {
        const route = this.registry[routePath];
        const execResult = !route.regexp ? null : route.regexp.exec(path);
        if (execResult) {
          matched = route;
          matchedRoutePath = routePath;
          matchedExecResult = execResult;
          break;
        }
      }
    }

    // 404
    if (!matched) {
      const notFoundPath =
        (!pathSegments[1] ? '/' : `/${pathSegments[1]}/`) +
        this.NOT_FOUND_PATH.replace(/^\//, '');
      matched =
        this.registry[notFoundPath] || this.registry[this.NOT_FOUND_PATH];
    }

    /*
     * 3. result
     */
    const {regexp, keys, params} =
      !matchedRoutePath || !matchedExecResult
        ? ({} as ReturnType<Router['extractParams']>)
        : this.extractParams(matchedRoutePath, matchedExecResult);
    const result: MatchResult = {
      url,
      path,
      routePath: matchedRoutePath,
      regexp,
      keys,
      params,
      layoutRoute: matched?.layout,
      pageRoute: matched?.page,
    };
    if (matched) this.cache.set(path, result);
    return result;
  }

  private extractParams(routePath: string, execResult: string[]) {
    const keys: Key[] = [];
    const regexp = pathToRegexp(routePath, keys);
    // extract params
    const params = {} as Record<string, any>;
    for (let i = 1; i < execResult.length; i++) {
      const key = keys[i - 1];
      const prop = key.name;
      const value = execResult[i];
      if (value !== undefined || !Object.hasOwnProperty.call(params, prop)) {
        if (key.modifier === '+' || key.modifier === '*') {
          params[prop] = value
            ? value.split(/[/?#]/).map(item => this.decodeParam(item))
            : [];
        } else {
          params[prop] = value ? this.decodeParam(value) : value;
        }
      }
    }
    // result
    return {regexp, keys, params};
  }

  private registerOutlet() {
    if (customElements.get(ROUTER_OUTLET_TAG_NAME)) return;
    customElements.define(ROUTER_OUTLET_TAG_NAME, RouterOutletComponent);
  }

  private registerTriggers() {
    // link trigger
    if (this.options.linkTrigger) {
      addEventListener('click', e => {
        const {
          origin: locationOrigin,
          pathname: locationPathname,
          href: locationHref,
        } = location;
        // pre-check
        if (
          e.defaultPrevented || // the default action is prevented
          e.button !== 0 || // not with the primary mouse button
          // a modifier key is pressed
          e.shiftKey ||
          e.ctrlKey ||
          e.altKey ||
          e.metaKey
        )
          return;
        // process anchor
        let anchor: null | HTMLAnchorElement = null;
        const paths = (
          !e.composedPath ? (e as any).path || [] : e.composedPath()
        ) as HTMLElement[];
        for (let i = 0; i < paths.length; i++) {
          if (paths[i]?.tagName?.toLowerCase() === 'a') {
            anchor = paths[i] as HTMLAnchorElement;
            break;
          }
        }
        // validation
        const testTarget = anchor?.target?.toLowerCase() || '';
        const testHref = anchor?.href?.toLowerCase() || '';
        if (
          !anchor || // no anchor
          (testTarget && testTarget !== '_self') || // has target
          /^javascript:(void\(0\);?)|;$/.test(testHref) || // js void
          testHref.startsWith('mailto:') || // mailto protocol
          testHref.startsWith('tel:') || // tel protocol
          anchor.hasAttribute('download') || // has download
          anchor.hasAttribute('router-ignore') || // has router-ignore
          (anchor.pathname === locationPathname && anchor.hash !== '') || // a fragment on the current page
          (anchor.origin || this.getAnchorOrigin(anchor)) !== locationOrigin // cross origin
        )
          return;
        // do navigation
        if (anchor.href !== locationHref) {
          const url = new URL(anchor.href);
          history.pushState({}, '', url.href);
          this.onRouteChanges(url);
        }
        e.preventDefault();
        scrollTo(0, 0);
      });
    }
    // popstate trigger
    addEventListener('popstate', e => {
      this.onRouteChanges(new URL(location.href));
      e.preventDefault();
    });
  }

  private onRouteChanges(url: URL) {
    const detail = this.match(url);
    if (this.callback) this.callback(detail);
    return dispatchEvent(new CustomEvent(ROUTE_CHANGE_EVENT, {detail}));
  }

  private getAnchorOrigin(anchor: HTMLAnchorElement) {
    const port = anchor.port;
    const protocol = anchor.protocol;
    const defaultHttp = protocol === 'http:' && port === '80';
    const defaultHttps = protocol === 'https:' && port === '443';
    const host =
      defaultHttp || defaultHttps
        ? anchor.hostname // without port
        : anchor.host; // with port
    return `${protocol}//${host}`;
  }

  private decodeParam(val: string) {
    try {
      return decodeURIComponent(val);
    } catch (err) {
      return val;
    }
  }

  private buildRegistry(routes: Route[]) {
    const processPath = (path: string) => path.replace(/^\/|\/$/g, '');
    const is404Path = (id: string) =>
      id.substring(id.length - 3, id.length) === this.NOT_FOUND_PATH;
    return routes.reduce(
      (result, route) => {
        if (!route.children?.length) {
          const id = `/${processPath(route.path)}`;
          result[id] = {
            regexp: is404Path(id) ? undefined : pathToRegexp(id),
            page: route,
          };
        } else {
          route.children.forEach(child => {
            let id =
              (!route.path ? '' : `/${processPath(route.path)}`) +
              (!child.path ? '' : `/${processPath(child.path)}`);
            id ||= '/';
            result[id] = {
              regexp: is404Path(id) ? undefined : pathToRegexp(id),
              page: child,
              layout: route,
            };
          });
        }
        return result;
      },
      {} as Router['registry']
    );
  }
}
