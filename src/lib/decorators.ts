import {
  getRouter,
  getCurrentRoute,
  getRouteParams,
  getNavIndicator,
} from './methods';

export function GetRouter() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getRouter(),
      enumerable: false,
      configurable: false,
    });
  };
}

export function CurrentRoute() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getCurrentRoute(),
      enumerable: false,
      configurable: false,
    });
  };
}

export function RouteParams() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getRouteParams(),
      enumerable: false,
      configurable: false,
    });
  };
}

export function GetNavIndicator() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getNavIndicator(),
      enumerable: false,
      configurable: false,
    });
  };
}
