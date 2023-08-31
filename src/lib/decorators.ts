import {getRouter, getActiveRoute, getParams, getNavIndicator} from './methods';

export function GetRouter() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getRouter(),
      enumerable: false,
      configurable: false,
    });
  };
}

export function ActiveRoute() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getActiveRoute(),
      enumerable: false,
      configurable: false,
    });
  };
}

export function RouteParams() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getParams(),
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
