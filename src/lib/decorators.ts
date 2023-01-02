import {getRouter} from './main';

export function UseRouter() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getRouter(),
      enumerable: false,
      configurable: false,
    });
  };
}
