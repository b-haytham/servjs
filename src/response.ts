import { ServerResponse } from 'http';

export class Response {
  private raw: ServerResponse;

  constructor(serverResponse: ServerResponse) {
    this.raw = serverResponse;
  }

  getHeader(name: string) {
    return this.raw.getHeader(name);
  }

  setHeader(name: string, value: string) {
    this.raw.setHeader(name, value);
  }

  get req() {
    return this.raw.req;
  }

  get headers() {
    return this.raw.getHeaders();
  }

  get rawRes() {
    return this.raw;
  }

  status(code: number) {
    this.raw.statusCode = code;
    return this;
  }

  send(body: any) {
    this.raw.end(body);
  }
}
