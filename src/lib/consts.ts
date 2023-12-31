import {
  GLOBAL_TINI as BASE_GLOBAL_TINI,
  TINI_APP_CONTEXT as BASE_TINI_APP_CONTEXT,
} from '@tinijs/core';

import {Router} from './router';

export const MODULE_NAME = 'router';
export const MODULE_ID = `tini:${MODULE_NAME}`;

export const GLOBAL_TINI = BASE_GLOBAL_TINI;
export const TINI_APP_CONTEXT =
  BASE_TINI_APP_CONTEXT as typeof BASE_TINI_APP_CONTEXT & {
    router?: Router;
  };

export const ROUTE_CHANGE_EVENT = `${MODULE_ID}:change`;

export const ROUTER_OUTLET_TAG_NAME = 'router-outlet';
export const NAV_INDICATOR_ID = 'nav-indicator';
export const NAV_INDICATOR = `app-${NAV_INDICATOR_ID}`;
export const CLASS_ACTIVE = 'active';

export const NO_ROUTER_ERROR = 'Router is not initialized.';
export const NO_OUTLET_ROUTER_ERROR = 'Router instance is not provided.';
