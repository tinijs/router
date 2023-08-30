# TiniJS Router 

The official router module for the TiniJS framework. It is currently under development.

Another option for adding routes to a TiniJS app is using [@vaadin/router](https://github.com/vaadin/router).

## Install

To manually install the module: `npm i @tinijs/router`

It is recommended to download the [Skeleton](https://github.com/tinijs/skeleton) for a ready-to-use structured project.

For more, please visit: <https://tinijs.dev> (TODO)

## Usage

- Add the `routes.ts`

```ts
import {Route} from '@tinijs/router';

export default [
  {
    path: '',
    component: 'app-layout-default',
    children: [
      {
        path: '',
        component: 'app-page-home',
        action: () => import('./pages/home'),
      },
      {
        path: 'articles/:slug',
        component: 'app-page-article',
        action: () => import('./pages/article'),
      },
      {
        path: '**',
        component: 'app-page-404',
        action: () => import('./pages/404'),
      },
    ],
  },
] as Route[];
```

- Register the routes in `app.ts`

```ts
import {html} from 'lit';
import {TiniComponent, App} from '@tinijs/core';
import {createRouter} from '@tinijs/router';

import routes from './routes';

@App()
export class AppRoot extends TiniComponent {
  public readonly $router = createRouter(routes, {linkTrigger: true});

  protected render() {
    return html`<router-outlet .router=${this.$router}></router-outlet>`;
  }
}
```

- Retrieve the routing context

```ts
import {TiniComponent, Page} from '@tinijs/core';
import {
  GetRouter,
  Router,
  CurrentRoute,
  MatchResult,
  RouteParams
} from '@tinijs/router';

interface PageParams {
  slug: string;
}

@Page()
export class ArticlePage extends TiniComponent {
  // router instance
  @GetRouter() private readonly router!: Router;

  // current route
  @CurrentRoute() private readonly route!: MatchResult;

  // route params
  @RouteParams() private readonly params!: PageParams;
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
