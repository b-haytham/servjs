import { pathToRegexp } from 'path-to-regexp';
import { RequestHandler } from './application';
import { DEFAULT_ROUTE_METHODS, normalizePath } from './common';

export type RequestMethods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'HEAD';
export type Route = {
  path: string;
  regex: RegExp;
  methods: {
    GET: RequestHandler[];
    POST: RequestHandler[];
    PATCH: RequestHandler[];
    PUT: RequestHandler[];
    HEAD: RequestHandler[];
    ALL: RequestHandler[];
  };
};

export class Router {
  private prefix: string;

  private _routes: Route[] = [];

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  get(path: string, ...handlers: RequestHandler[]) {
    const fullPath = normalizePath(this.prefix, path);
    const route = this._routes.find(r => r.path === fullPath);
    if (!route) {
      this._routes.push({
        path: fullPath,
        regex: pathToRegexp(fullPath),
        methods: {
          ...DEFAULT_ROUTE_METHODS,
          GET: handlers,
        },
      });
      return this;
    }
    route.methods['GET'] = handlers;
    return this;
  }

  post(path: string, ...handlers: RequestHandler[]) {
    const fullPath = normalizePath(this.prefix, path);
    const route = this._routes.find(r => r.path === fullPath);
    if (!route) {
      this._routes.push({
        path: fullPath,
        regex: pathToRegexp(fullPath),
        methods: {
          ...DEFAULT_ROUTE_METHODS,
          POST: handlers,
        },
      });
      return this;
    }
    route.methods['POST'] = handlers;
    return this;
  }

  put(path: string, ...handlers: RequestHandler[]) {
    const fullPath = normalizePath(this.prefix, path);
    const route = this._routes.find(r => r.path === fullPath);
    if (!route) {
      this._routes.push({
        path: fullPath,
        regex: pathToRegexp(fullPath),
        methods: {
          ...DEFAULT_ROUTE_METHODS,
          PUT: handlers,
        },
      });
      return this;
    }
    route.methods['PUT'] = handlers;
    return this;
  }

  patch(path: string, ...handlers: RequestHandler[]) {
    const fullPath = normalizePath(this.prefix, path);
    const route = this._routes.find(r => r.path === fullPath);
    if (!route) {
      this._routes.push({
        path: fullPath,
        regex: pathToRegexp(fullPath),
        methods: {
          ...DEFAULT_ROUTE_METHODS,
          PATCH: handlers,
        },
      });
      return this;
    }
    route.methods['PATCH'] = handlers;
    return this;
  }

  routes() {
    return this._routes;
  }
}
