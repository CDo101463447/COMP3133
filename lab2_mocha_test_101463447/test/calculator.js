const chai = require('chai');
const calculator = require('../app/calculator')

const expect = chai.expect;

describe('Calculator', function() {
  describe('add()', function() {
    it('should return 7 when adding 5 and 2', function() {
      const result = calculator.add(5, 2);
      const expected = 7;
      const testResult = result === expected ? 'PASS' : 'FAIL';
      console.log(`add(5, 2) expected result ${expected}: ${testResult}`);
      expect(result).to.equal(expected);
    });
    it('should return 8 when adding 5 and 2 (wrong test for failure)', function() {
      const result = calculator.add(5, 2);
      const expected = 8;
      const testResult = result === expected ? 'PASS' : 'FAIL';
      console.log(`add(5, 2) expected result ${expected}: ${testResult}`);
      expect(result).to.equal(expected);
    });
  });

  describe('sub()', function() {
    it('should return 3 when subtracting 2 from 5', function() {
      const result = calculator.sub(5, 2);
      const expected = 3;
      const testResult = result === expected ? 'PASS' : 'FAIL';
      console.log(`sub(5, 2) expected result ${expected}: ${testResult}`);
      expect(result).to.equal(expected);
    });
    it('should return 5 when subtracting 2 from 5 (wrong test for failure)', function() {
      const result = calculator.sub(5, 2);
      const expected = 5;
      const testResult = result === expected ? 'PASS' : 'FAIL';
      console.log(`sub(5, 2) expected result ${expected}: ${testResult}`);
      expect(result).to.equal(expected);
    });
  });

  describe('mul()', function() {
    it('should return 10 when multiplying 5 and 2', function() {
      const result = calculator.mul(5, 2);
      const expected = 10;
      const testResult = result === expected ? 'PASS' : 'FAIL';
      console.log(`mul(5, 2) expected result ${expected}: ${testResult}`);
      expect(result).to.equal(expected);
    });
    it('should return 12 when multiplying 5 and 2 (wrong test for failure)', function() {
      const result = calculator.mul(5, 2);
      const expected = 12;
      const testResult = result === expected ? 'PASS' : 'FAIL';
      console.log(`mul(5, 2) expected result ${expected}: ${testResult}`);
      expect(result).to.equal(expected);
    });
  });

  describe('div()', function() {
    it('should return 5 when dividing 10 by 2', function() {
      const result = calculator.div(10, 2);
      const expected = 5;
      const testResult = result === expected ? 'PASS' : 'FAIL';
      console.log(`div(10, 2) expected result ${expected}: ${testResult}`);
      expect(result).to.equal(expected);
    });
    it('should return 2 when dividing 10 by 2 (wrong test for failure)', function() {
      const result = calculator.div(10, 2);
      const expected = 2;
      const testResult = result === expected ? 'PASS' : 'FAIL';
      console.log(`div(10, 2) expected result ${expected}: ${testResult}`);
      expect(result).to.equal(expected);
    });
  });
});
