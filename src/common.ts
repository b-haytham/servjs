import { log } from './utils';
import { Route } from './router';
import { HttpContext } from './application';

export const DEFAULT_ROUTE_METHODS: Route['methods'] = {
  GET: [],
  PATCH: [],
  POST: [],
  ALL: [],
  HEAD: [],
  PUT: [],
};

export const defaultErrorHandler = (err: Error, ctx: HttpContext) => {
  log.error('Error ', err.message);
  ctx.res.status(500).send('Server Error');
};

export const normalizePath = (prefix: string, path: string) => {
  if (prefix.endsWith('/') && path.startsWith('/')) {
    return prefix + path.slice(1);
  }
  const full = prefix + path;
  if (full.endsWith('/')) {
    return full.slice(0, -1);
  }
  return prefix + path;
};
