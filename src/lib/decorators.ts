import {getRouter, getActiveRoute, getParams, getNavIndicator} from './methods';

export function UseRouter() {
  return function (prototype: any, propertyName: string) {
    Object.defineProperty(prototype, propertyName, {
      get: () => getRouter(),
    });
  };
}

export function UseRoute() {
  return function (prototype: any, propertyName: string) {
    Object.defineProperty(prototype, propertyName, {
      get: () => getActiveRoute(),
    });
  };
}

export function UseParams() {
  return function (prototype: any, propertyName: string) {
    Object.defineProperty(prototype, propertyName, {
      get: () => getParams(),
    });
  };
}

export function UseNavIndicator() {
  return function (prototype: any, propertyName: string) {
    Object.defineProperty(prototype, propertyName, {
      get: () => getNavIndicator(),
    });
  };
}
