import {getAppInstance} from '@tinijs/core';

export function UseRouter() {
  return function (target: Object, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => getAppInstance().router,
    });
  };
}
