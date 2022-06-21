'use strict';

/**
 * Redirects default log functions
 *
 * On Mac   => ~/Library/Logs/[AppName-WithoutSpaces|AIO].log
 * On Win   => C:\Users\[UserName]\AppData\Local\[AppName-WithoutSpaces|AIO].log
 * On Linux => ~/.[AppName-WithoutSpaces|AIO].log
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const isDev = require('electron-is-dev');

// Set default output streams (STDOUT/STDERR) and an empty log file path
let output = process.stdout;
let errorOutput = process.stderr;
let logFile = null;

module.exports = (logFileName) => {
  try {
    switch (os.platform()) {
      case 'darwin':
        logFile = path.join(os.homedir(), 'Library/Logs', (logFileName || 'AIO').replace(' ', '') + '.log');
        break;
      case 'win32':
        logFile = path.join(os.homedir(), 'AppData', 'Local', (logFileName || 'AIO').replace(' ', '') + '.log');
        break;
      case 'linux':
        logFile = path.join(os.homedir(), '.' + (logFileName || 'AIO').replace(' ', '') + '.log');
        break;
      default:
      // Others: leave untouched
    }
  } catch (e) {
    console.warn('Error creating log file: ' + e);
  }

  // If we are in production and a log file is defined we redirect logs to that file
  if (!isDev && logFile) {
    output = fs.createWriteStream(logFile);
    errorOutput = fs.createWriteStream(logFile);
  }

  // Create common logger
  const logger = new console.Console(output, errorOutput);

  // Override default log utilities
  console.log = () => {
    arguments[0] = new Date().toISOString() + ' - ' + arguments[0];
    logger.log.apply(null, arguments);
  };

  console.debug = () => {
    arguments[0] = new Date().toISOString() + ' - <Debug> ' + arguments[0];
    if (isDev || (global.appSettings && global.appSettings.debug)) {
      logger.log.apply(null, arguments);
    }
  };

  console.info = () => {
    arguments[0] = new Date().toISOString() + ' - <Info> ' + arguments[0];
    logger.log.apply(null, arguments);
  };

  console.warn = () => {
    arguments[0] = new Date().toISOString() + ' - <Warning> ' + arguments[0];
    logger.log.apply(null, arguments);
  };

  console.error = () => {
    arguments[0] = new Date().toISOString() + ' - <Error> ' + arguments[0];
    logger.log.apply(null, arguments);
  };
};
