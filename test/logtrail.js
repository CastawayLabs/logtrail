/*
 *
 */
var path = require('path'),
    expect = require('chai').expect,
    Logtrail = require('../logtrail.js');

describe('Logtrail', function () {

  it('should be instantiable', function () {
    var logger = new Logtrail();
    expect(logger).to.be.an('object');
    expect(logger).to.be.an.instanceof(Logtrail);
  });
  it('should have a private object storing configuration', function () {
    var logger = new Logtrail();
    expect(logger).to.have.a.property('_confs')
      .to.be.an('object')
      .to.have.a.property('timestamps')
      .to.be.an('object');
  });
  it('should parse config object passed as argument', function() {
    var confs = (new Logtrail({timestamps: {enabled: false}}))._confs;
    expect(confs).to.have.a.property('timestamps')
      .to.have.a.property('enabled', false);
  });
  it('should read config from file passed as argument', function() {
    var logtrail = new Logtrail(
      path.join(__dirname, 'example.json')
    );
    var confs = logtrail._confs;
    expect(confs).to.have.a.property('timestamps')
      .to.have.a.property('enabled', false);
  });
  it('should throw an error when passed invlid argument', function() {
    expect(Logtrail.bind(Logtrail, [])).to.throw(Error)
      .to.have.a.property('code', 'LOGTRAIL_BADARG');
  });
  it('should have functions for each logtype', function () {
    var logtrail = new Logtrail(),
        logTypes = Object.keys(logtrail._logTypes).map(function (id) {
          return logtrail._logTypes[id];
        });
    logTypes.forEach(function (logtype) {
      expect(logtrail).to.have.a.property(logtype);
      expect(logtrail[logtype]).to.be.a('function');
    });
    expect(logtrail).to.have.a.property('log');
    expect(logtrail.log).to.be.a('function');
  });

});
