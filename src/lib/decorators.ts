import {getRouter, getNavIndicator} from './methods';

export function UseRouter() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getRouter(),
      enumerable: false,
      configurable: false,
    });
  };
}

export function UseNavIndicator() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getNavIndicator(),
      enumerable: false,
      configurable: false,
    });
  };
}
