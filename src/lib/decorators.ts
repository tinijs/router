export function UseRouter() {
  return function (target: Record<string, unknown>, propertyKey: string) {
    Reflect.defineProperty(target, propertyKey, {
      get: () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const app = document.querySelector('app-root') as any;
        if (!app) throw new Error('No TiniJS app found.');
        return app.router;
      },
    });
  };
}
