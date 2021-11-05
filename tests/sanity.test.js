'use strict';

const chai = require('chai');
const expect = chai.expect;
describe('sanity test', function () {
  context('when testing true value', function () {
    it('should be truthy', function () {
      expect(true).to.be.true;
    });
  });
});
