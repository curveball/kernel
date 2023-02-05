import { Headers } from './headers.js';
import { Response, Body } from './response.js';

export class MemoryResponse<T = Body> extends Response<T> {

  constructor(origin: string) {

    super(origin);
    this.headers = new Headers();
    this.status = 200;
    (this.body as any) = null;

  }

  /**
   * An object containing all headers.
   */
  headers: Headers;

}

export default MemoryResponse;
