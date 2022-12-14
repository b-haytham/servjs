import { IncomingMessage } from 'http';
import { parse as parseurl, UrlWithStringQuery } from 'url';
import getRawBody from 'raw-body';
import contentType from 'content-type';
import { parseQuery } from './utils';

export class Request {
  private raw: IncomingMessage;
  private URL: UrlWithStringQuery;
  private _pathname: string | null;
  private _query: Record<string, any> = {};
  private _data: Record<string, any> = {};
  private _params: Record<string, any> = {};
  private _body?: any;

  constructor(incomingMessage: IncomingMessage) {
    this.raw = incomingMessage;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.URL = parseurl(this.raw.url!);
    this._pathname = this.URL.pathname;
    this._query = parseQuery(this.URL.search);
  }

  get(field: string) {
    switch ((field = field.toLowerCase())) {
      case 'referer':
      case 'referrer':
        return (
          this.raw.headers.referrer || this.raw.headers.referer || undefined
        );
      default:
        return this.raw.headers[field] || undefined;
    }
  }

  async getRawBody() {
    return getRawBody(this.raw, {
      length: this.headers['content-length'],
      limit: '1mb',
      encoding: contentType.parse(this.raw).parameters.charset,
    });
  }

  get body() {
    return this._body;
  }

  set body(val) {
    this._body = val;
  }

  get data() {
    return this._data;
  }

  get url() {
    return this.raw.url;
  }

  get method() {
    return this.raw.method;
  }

  get headers() {
    return this.raw.headers;
  }

  get socket() {
    return this.raw.socket;
  }

  get pathname() {
    return this._pathname;
  }

  get query() {
    return this._query;
  }

  get rawRequest() {
    return this.raw;
  }

  get params() {
    return this._params;
  }

  // setters
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  set data(obj) {
    this._data = obj;
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  set params(obj) {
    this._params = obj;
  }
}
