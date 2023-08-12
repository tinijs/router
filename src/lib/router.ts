import {Route, RouterOptions, MatchResult} from './types';
import {ROUTER_OUTLET_TAG_NAME} from './consts';
import {go} from './methods';
import {TiniRouterOutlet} from './router-outlet';

export class TiniRouter {
  private callback?: (result: MatchResult) => void;
  private readonly flatRoutes: Record<string, {layout?: Route; page: Route}>;
  indicatorSchedule: null | number = null;

  constructor(
    public readonly routes: Route[],
    public readonly options: RouterOptions = {}
  ) {
    this.flatRoutes = this.buildFlatRoutes(routes);
  }

  go(to: string) {
    return go(to);
  }

  init() {
    this.registerOutlet();
    this.registerTriggers();
    return this as TiniRouter;
  }

  setCallback(cb: (result: MatchResult) => void) {
    this.callback = cb;
    return this as TiniRouter;
  }

  match(url: URL): MatchResult {
    // TODO: fix this
    // FIX ME: this is a very naive implementation
    const pathSegments = url.pathname.split('/');
    const fallbackPath =
      (!pathSegments[1] ? '/' : `/${pathSegments[1]}/`) + '**';
    const {layout, page} =
      this.flatRoutes[url.pathname] ||
      this.flatRoutes[fallbackPath] ||
      this.flatRoutes['/**'] ||
      {};
    // result
    return {url, layoutRoute: layout, pageRoute: page};
  }

  private registerOutlet() {
    if (customElements.get(ROUTER_OUTLET_TAG_NAME)) return;
    customElements.define(ROUTER_OUTLET_TAG_NAME, TiniRouterOutlet);
  }

  private registerTriggers() {
    // link trigger
    if (this.options.linkTrigger) {
      addEventListener('click', e => {
        const {
          origin: locationOrigin,
          pathname: locationPathname,
          href: locationHref,
        } = window.location;
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
          /^javascript\:(void\(0\);?)|;$/.test(testHref) || // js void
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
        window.scrollTo(0, 0);
      });
    }
    // popstate trigger
    addEventListener('popstate', e => {
      this.onRouteChanges(new URL(window.location.href));
      e.preventDefault();
    });
  }

  private onRouteChanges(url: URL) {
    const detail = this.match(url);
    if (this.callback) this.callback(detail);
    return dispatchEvent(new CustomEvent('route', {detail}));
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

  private buildFlatRoutes(routes: Route[]) {
    const processPath = (path: string) => path.replace(/^\/|\/$/g, '');
    return routes.reduce(
      (result, route) => {
        if (!route.children?.length) {
          const id = `/${processPath(route.path)}`;
          result[id] = {page: route};
        } else {
          route.children.forEach(child => {
            const id =
              (!route.path ? '' : `/${processPath(route.path)}`) +
              (!child.path ? '' : `/${processPath(child.path)}`);
            result[id || '/'] = {layout: route, page: child};
          });
        }
        return result;
      },
      {} as TiniRouter['flatRoutes']
    );
  }
}
