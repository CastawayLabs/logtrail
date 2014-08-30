/*
 *
 */

var path = require('path'),
    expect = require('chai').expect,
    Logtrail = require('../lib/logtrail.js');

describe('Logtrail', function () {
  var logger;

  beforeEach(function () {
    logger = new Logtrail;
  });

  it('should be instantiable', function () {
    expect(logger).to.be.an('object');
    expect(logger).to.be.an.instanceof(Logtrail);
  });

  it('should have a private object storing configuration', function () {
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

  it('should throw an error when passed invalid argument', function() {
    expect(logger.configure.bind(logger, [])).to.throw(Error)
      .to.have.a.property('code', 'LOGTRAIL_BADARG');
  });

  it('should have functions for each logtype', function () {
    var logTypes = Object.keys(logger._logTypes).map(function (id) {
      return logger._logTypes[id];
    });

    logTypes.forEach(function (logtype) {
      expect(logger).to.have.a.property(logtype);
      expect(logger[logtype]).to.be.a('function');
    });
    expect(logger).to.have.a.property('log');
    expect(logger.log).to.be.a('function');
  });

});
