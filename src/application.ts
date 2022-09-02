import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { pathToRegexp, match } from 'path-to-regexp';
import { defaultErrorHandler, DEFAULT_ROUTE_METHODS } from './common';
import { Request } from './request';
import { Response } from './response';
import { RequestMethods, Route, Router } from './router';
import { log } from './utils';

export type ApplicationOptions = Record<string, any>;

export type HttpContext = {
  req: Request;
  res: Response;
  state: Record<string, any>;
  params: Record<string, any>;
  query: Record<string, any>;
};

export type RequestHandler = (ctx: HttpContext) => void | Promise<void>;
export type ErrorHandler = (
  error: Error,
  ctx: HttpContext,
) => void | Promise<void>;

export class Application {
  private httpServer?: Server;
  private options: ApplicationOptions = {};

  private state: Record<string, any> = {};

  private homeHandlers: RequestHandler[] = [];
  private errorHandler: ErrorHandler = defaultErrorHandler;

  private routes: Route[] = [];

  constructor(options?: ApplicationOptions) {
    if (options) this.options = options;
  }

  use(...handlers: RequestHandler[]) {
    handlers.forEach(handler => this.homeHandlers.push(handler));
    return this;
  }

  get(path: string, ...handlers: RequestHandler[]) {
    const route = this.routes.find(r => r.path == path);
    if (!route) {
      this.routes.push({
        path: path,
        regex: pathToRegexp(path),
        methods: {
          ...DEFAULT_ROUTE_METHODS,
          GET: handlers,
        },
      });
      return this;
    }

    route.methods.GET = handlers;
    return this;
  }

  post(path: string, ...handlers: RequestHandler[]) {
    const route = this.routes.find(r => r.path == path);
    if (!route) {
      this.routes.push({
        path: path,
        regex: pathToRegexp(path),
        methods: {
          ...DEFAULT_ROUTE_METHODS,
          POST: handlers,
        },
      });
      return this;
    }

    route.methods.POST = handlers;
    return this;
  }

  put(path: string, ...handlers: RequestHandler[]) {
    const route = this.routes.find(r => r.path == path);
    if (!route) {
      this.routes.push({
        path: path,
        regex: pathToRegexp(path),
        methods: {
          ...DEFAULT_ROUTE_METHODS,
          PUT: handlers,
        },
      });
      return this;
    }

    route.methods.PUT = handlers;
    return this;
  }

  patch(path: string, ...handlers: RequestHandler[]) {
    const route = this.routes.find(r => r.path == path);
    if (!route) {
      this.routes.push({
        path: path,
        regex: pathToRegexp(path),
        methods: {
          ...DEFAULT_ROUTE_METHODS,
          PATCH: handlers,
        },
      });
      return this;
    }

    route.methods.PATCH = handlers;
    return this;
  }

  all(path: string, ...handlers: RequestHandler[]) {
    const route = this.routes.find(r => r.path == path);
    if (!route) {
      this.routes.push({
        path: path,
        regex: pathToRegexp(path),
        methods: {
          ...DEFAULT_ROUTE_METHODS,
          ALL: handlers,
        },
      });
      return this;
    }

    route.methods.ALL = handlers;
    return this;
  }

  router(router: Router) {
    const routerRoutes = router.routes();
    routerRoutes.forEach(r => {
      const existingRoute = this.routes.find(route => route.path == r.path);
      if (existingRoute) {
        existingRoute.methods = r.methods;
      } else {
        this.routes.push(r);
      }
    });

    return this;
  }

  error(handler: ErrorHandler) {
    this.errorHandler = handler;
  }

  private async handleServerRequest(req: IncomingMessage, res: ServerResponse) {
    const request = new Request(req);
    const response = new Response(res);

    const context = {
      req: request,
      res: response,
      state: this.state,
      query: {},
      params: {},
    };

    for (const handler of this.homeHandlers) {
      try {
        await handler(context);
      } catch (error: any) {
        this.errorHandler(error, context);
        break;
      }
    }

    const route = this.routes.find(r => {
      const match = request.pathname ? r.regex.exec(request.pathname) : null;
      return match;
    });

    if (!route) {
      res.statusCode = 404;
      return res.end('Not Found');
    }

    if (
      !request.method ||
      route.methods[request.method as RequestMethods].length == 0
    ) {
      res.statusCode = 404;
      return res.end('Not Found');
    }

    const fn = match(route.path, { decode: decodeURIComponent });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = fn(request.pathname!) as Record<string, any>;

    request.params = result.params;
    context.params = result.params;

    const handlers = route.methods[request.method as RequestMethods];
    for (const handler of handlers) {
      try {
        await handler(context);
      } catch (error: any) {
        this.errorHandler(error, context);
        break;
      }
    }
  }

  listen(port: number, cb: () => void) {
    this.routes.forEach(r => log.trace('Route: ', `${r.path} | ${r.regex}`));
    this.httpServer = createServer((req, res) =>
      this.handleServerRequest(req, res),
    );
    this.httpServer.listen(port, cb);
  }
}
