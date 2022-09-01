import { createServer, IncomingMessage, Server, ServerResponse } from "http";

export type ApplicationOptions = {}

export class Application {
  private httpServer?: Server;

  constructor(options?: ApplicationOptions) {}

  private handleServerRequest(req: IncomingMessage, res: ServerResponse) {
    console.log(req.url);
    res.statusCode = 200
    res.end(req.url);
  }

  listen(port: number, cb: () => void) {
    this.httpServer = createServer((req, res) => this.handleServerRequest(req, res));
    this.httpServer.listen(port, cb);
  }
}
