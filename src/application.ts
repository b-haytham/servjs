import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { Request } from './request';

export type ApplicationOptions = Record<string, any>;

export class Application {
  private httpServer?: Server;
  private options: ApplicationOptions = {};

  constructor(options?: ApplicationOptions) {
    if (options) this.options = options;
  }

  private handleServerRequest(req: IncomingMessage, res: ServerResponse) {
    const request = new Request(req);

    console.log(request.headers);
    console.log(request.pathname);
    console.log(request.query);
    console.log(request.data);
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
