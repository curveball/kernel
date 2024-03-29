import { Readable } from 'node:stream';

import { Headers, HeadersInterface, HeadersObject } from './headers.js';
import { Request, Encoding } from './request.js';

export class MemoryRequest<T> extends Request<T> {

  /**
   * List of HTTP Headers
   */
  headers: HeadersInterface;

  /**
   * Contains a parsed, stored representation of the body. It's up to
   * middlewares to do the actual parsing.
   */
  body: T;

  constructor(method: string, requestTarget: string, origin: string, headers?: HeadersInterface | HeadersObject, body: any = null, absoluteUrl?: string) {

    super(method, requestTarget, origin);
    if (headers?.get !== undefined) {
      this.headers = headers as HeadersInterface;
    } else {
      this.headers = new Headers(headers as HeadersObject);
    }
    this.originalBody = body;
    // @ts-expect-error Typescript doesn't like null here because it might be
    // incompatible with T, but we're ignoring it as it's a good default.
    this.body = null;

  }

  /**
   * Internal representation of body.
   *
   * We keep a private copy so we can maintain compatibility with rawBody.
   */
  private originalBody: Buffer|string|Record<string, any>|null;

  /**
   * This function returns the request body.
   *
   * If encoding is not specified, this function returns a Buffer. If encoding
   * is specified, it will return a string.
   * This function returns the request body.
   *
   * If encoding is not specified, this function returns a Buffer. If encoding
   * is specified, it will return a string.
   *
   * You can only call this function once. Most likely you'll want a single
   * middleware that calls this function and then sets `body`.
   */
  rawBody(encoding?: Encoding, limit?: string): Promise<string>;
  rawBody(encoding?: undefined, limit?: string): Promise<Buffer>;
  async rawBody(encoding?: undefined|Encoding, limit?: string): Promise<Buffer|string> {

    return this.getBody(encoding);

  }

  /**
   * getStream returns a Node.js readable stream.
   *
   * A stream can typically only be read once.
   */
  getStream(): Readable {

    const s = new Readable();
    s.push(this.getBody());
    s.push(null);
    return s;

  }

  private getBody(encoding?: Encoding) {

    if (!this.originalBody) {
      // Memoizing the null case
      this.originalBody = '';
    }
    if (typeof this.originalBody === 'object' && !(this.originalBody instanceof Buffer)) {
      // Memoizing the JSON object case.
      this.originalBody = JSON.stringify(this.originalBody, null, 2);
    }

    if (this.originalBody instanceof Buffer) {
      // The buffer case
      if (typeof encoding === 'undefined') {
        return this.originalBody;
      } else {
        return this.originalBody.toString(encoding);
      }
    } else {
      // The string case
      if (typeof encoding === 'undefined') {
        return Buffer.from(this.originalBody);
      } else {
        return this.originalBody;
      }
    }

  }

}

export default MemoryRequest;
