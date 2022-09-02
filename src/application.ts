import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { Request } from './request';
import { log } from './utils';

export type ApplicationOptions = Record<string, any>;

export class Application {
  private httpServer?: Server;
  private options: ApplicationOptions = {};

  constructor(options?: ApplicationOptions) {
    if (options) this.options = options;
  }

  private handleServerRequest(req: IncomingMessage, res: ServerResponse) {
    const request = new Request(req);

    log.trace('Pathname: ', `${request.pathname}`);
    log.trace('Query: ', `${JSON.stringify(request.query)}`);

    res.statusCode = 200;
    res.end(req.url);
  }

  listen(port: number, cb: () => void) {
    this.httpServer = createServer((req, res) =>
      this.handleServerRequest(req, res),
    );
    this.httpServer.listen(port, cb);
  }
}
