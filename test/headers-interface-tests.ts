import { expect } from 'chai';
import { HeadersInterface } from '../src/headers';

/**
 * This function builds new tests based on an implementation of
 * HeaderInterface.
 *
 * It ensures that the interface was correctly implemented.
 */
export default function headersTest(headers: HeadersInterface) {

  describe('Interface tests', () => {

    describe('get', () => {

      it('should return null when a header was not set', () => {

        expect(headers.get('foo')).to.equal(null);

      });

      it('should return a string for string headers', () => {

        headers.set('Content-Type', 'text/html');
        expect(headers.get('Content-Type')).to.equal('text/html');

      });

      it('should also return values when asking for a header with a different case', () => {

        expect(headers.get('cONTENT-tYPE')).to.equal('text/html');

      });
      
      it('should return a string for number headers', () => {

        headers.set('Content-Length', 5);
        expect(headers.get('Content-Length')).to.equal('5');

      });

      it('should concatenate multiple headers with the same name', () => {

        headers.set('Accept', ['text/html', 'text/plain']),
        expect(headers.get('Accept')).to.equal('text/html,text/plain');

      });

    });

  });

}
