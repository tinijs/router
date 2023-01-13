# TiniJS Router 

The router module for the TiniJS framework.

It uses the [@vaadin/router](https://github.com/vaadin/router) under the hood.

## Install

To manually install the module: `npm i @tinijs/router`

It is recommended to download the [Skeleton](https://github.com/tinijs/skeleton) for a ready-to-use structured project.

For more, please visit: <https://tinijs.dev>

## Usage

- Add the `routes.ts`

```ts
import {Route} from '@tinijs/router';

const routes: Route[] = [
  {
    path: '',
    component: 'layout-default',
    children: [
      {
        path: '',
        component: 'page-home',
      },
      {
        path: '(.*)',
        component: 'page-404',
      },
    ],
  },
];

export default routes;
export type Routes = typeof routes;
```

- Register the routes in `app.ts`

```ts
import {registerRoutes, Router} from '@tinijs/router';

import routes from './routes';

@App()
export class AppRoot extends TiniComponent {
  $router!: Router;

  onReady() {
    this.$router = registerRoutes(routes);
  }
}
```

## API

// TODO

## Developement

- Create a home for TiniJS: `mkdir TiniJS && cd TiniJS`
- Fork the repo: `git clone https://github.com/tinijs/router.git`
- Install dependencies: `cd router && npm i`
- Make changes & preview locally: `npm run build && npm pack`
- Push changes & create a PR 👌

## License

**@tinijs/router** is released under the [MIT](https://github.com/tinijs/core/blob/master/LICENSE) license.
