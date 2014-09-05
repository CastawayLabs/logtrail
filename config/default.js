/*
 *
 */

module.exports = {
  'basedir': require('path').join(__dirname, '..'),
  'indents': true,
  'loglevel': 0,
  'timestamp':  'YYYY-MM-DD HH:mm:ss',
  'logs': {
    'default': {
      'level': 0,
      'target': [process.stdout],
      'format': '%entry'
    },
    'debug': {
      'level': 10,
      'target': [process.stdout],
      'color': 'cyan',
      'flag': '[DBG]',
      'format': '%timestamp %stack %flag %entry'
    },
    'info': {
      'level': 20,
      'target': [process.stdout],
      'color': 'green',
      'flag': '[INF]',
      'format': '%timestamp %stack %flag %entry'
    },
    'warn': {
      'level': 30,
      'target': [process.stderr],
      'color': 'yellow',
      'flag': '[WRN]',
      'format': '%timestamp %stack %flag %entry'
    },
    'error': {
      'level': 40,
      'target': [process.stderr],
      'color': 'red',
      'flag': '[ERR]',
      'format': '%timestamp %stack %flag %entry'
    },
    'fatal': {
      'level': 50,
      'target': [process.stderr],
      'color': 'magenta',
      'flag': '[FAT]',
      'format': '%timestamp %stack %flag %entry'
    }
  }
};
