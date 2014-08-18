/*
 *
 */

var expect = require('chai').expect,
    extend = require('../lib/extend.js');

describe('extend()', function () {
  it('should return an empty object with no args', function () {
    var resultA = extend();
    var resultB = extend(true);
    expect(resultA).to.be.an('object');
    expect(resultB).to.be.an('object');
  });

  it('should overwrite values in target by values from source', function () {
    var target = {x: 1, y: '2', z: [3, 4]},
        source = {x: 5},
        result = extend(target, source);
    expect(result).to.be.an('object');
    expect(result).to.have.a.property('x', 5);
    expect(target).to.have.a.property('x', 5);
  });

  it('should do complete union of target with source', function () {
    var target = {x: 1, y: '2', z: [3, 4]},
        source = {x: '1', o: true},
        result = extend(target, source),
        expected = {x: '1', y: '2', z: [3, 4], o: true};
    expect(result).to.deep.equal(expected);
  });

  it('should extend empty objects', function () {
    var target = {},
        source = {x: '1', o: true},
        result = extend(target, source),
        expected = source;
    expect(result).to.deep.equal(expected);
  });

  it('should extend an empty object instead if target is null', function () {
    var target = null,
        source = {x: '1', o: true},
        result = extend(target, source),
        expected = source;
    expect(result).to.deep.equal(expected);
  });

  it('should extend an empty object if target is not an object', function () {
    var targetA = 'foobar',
        targetB = function () {},
        targetC = ['foo', 'bar', 'baz'],
        source = {x: '1', o: true},
        resultA = extend(targetA, source),
        resultB = extend(targetB, source),
        resultC = extend(targetC, source),
        expectedA, expectedB, expectedC;
    expectedA = expectedB = expectedC = source;
    expect(resultA).to.deep.equal(expectedA);
    expect(resultB).to.deep.equal(expectedB);
    expect(resultC).to.deep.equal(expectedC);
  });

  it('should not do deep extend without deep option set to true', function () {
    var target = {x: 1, y: '2', z: {a: 'foo'}},
        source = {x: '1', o: true, z: {b: 'bar'}},
        result = extend(target, source),
        expected = {x: '1', y: '2', z: {b: 'bar'}, o: true};
    expect(result).to.deep.equal(expected);
  });

  it('should do deep extend with deep option set to true', function () {
    var target = {x: 1, y: '2', z: {a: 'foo'}},
        source = {x: '1', o: true, z: {b: 'bar'}},
        result = extend(true, target, source),
        expected = {x: '1', y: '2', z: {a: 'foo', b: 'bar'}, o: true};
    expect(result).to.deep.equal(expected);
  });

  it('should do extends with multiple sources', function () {
    var target = {x: 1, y: '2', z: {a: 'foo'}},
        sourceA = {x: '1', o: true, z: {b: 'bar'}},
        sourceB = {x: 1, o: false, z: {c: 'qux'}},
        result = extend(target, sourceA, sourceB),
        expected = {x: 1, y: '2', z: {c: 'qux'}, o: false};
    expect(result).to.deep.equal(expected);
  });

  it('should do deep extends with multiple sources', function () {
    var target = {x: 1, y: '2', z: {a: 'foo'}},
        sourceA = {x: '1', o: true, z: {b: 'bar'}},
        sourceB = {x: 1, o: false, z: {c: 'qux'}},
        result = extend(true, target, sourceA, sourceB),
        expected = {x: 1, y: '2', z: {a: 'foo', b: 'bar', c: 'qux'}, o: false};
    expect(result).to.deep.equal(expected);
  });

  it('should ignore null objects as sources', function () {
    var target = {x: 1, y: '2', z: {a: 'foo'}},
        sourceA = null,
        sourceB = {x: 1, o: false, z: {c: 'qux'}},
        result = extend(true, target, sourceA, sourceB),
        expected = {x: 1, y: '2', z: {a: 'foo', c: 'qux'}, o: false};
    expect(result).to.deep.equal(expected);
  });
});
