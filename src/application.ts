import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { pathToRegexp, match } from 'path-to-regexp';
import { Request } from './request';
import { log } from './utils';

export type ApplicationOptions = Record<string, any>;

export type RequestHandler = (
  req: Request,
  res: ServerResponse,
) => void | Promise<void>;

type RequestMethods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'HEAD';

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

export class Application {
  private httpServer?: Server;
  private options: ApplicationOptions = {};

  private homeHandlers: RequestHandler[] = [];

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

  private async handleServerRequest(req: IncomingMessage, res: ServerResponse) {
    const request = new Request(req);

    for (const handler of this.homeHandlers) {
      try {
        await handler(request, res);
      } catch (error: any) {
        log.error(`Error: ${error.message}`);
      }
    }

    const route = this.routes.find(r => {
      const match = request.pathname ? r.regex.exec(request.pathname) : null;
      console.log(match);
      return match;
    });

    console.log(route);

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
    console.log('Result :: ', result.params);

    request.params = result.params;

    const handlers = route.methods[request.method as RequestMethods];
    for (const handler of handlers) {
      try {
        await handler(request, res);
      } catch (error: any) {
        log.error('Error: ', error.message);
        res.end();
      }
    }

    if (!res.writableEnded) {
      res.end();
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

const DEFAULT_ROUTE_METHODS: Route['methods'] = {
  GET: [],
  PATCH: [],
  POST: [],
  ALL: [],
  HEAD: [],
  PUT: [],
};
