const fs = require('fs'),
      date = require('date-and-time'),
      config = require('../config.json'),
      logger = require("./logger");

function uncaughtExceptionHandler() {
  process.on('uncaughtException', function (err) {
    logger.error("[  💥  ] >> Error detected".red)
    logger.error("[  📜  ] >> Save in the logs".gray);
    const now = new Date(),
          CreateFiles = fs.createWriteStream(__dirname+'/../logs/crash/' +
          date.format(now, 'DD.MM.YYYY HH;mm;ss') + ".txt", { flags: 'a' });
    let i = `${config.asciicrash}\n${err.stack || err.message}`;
    CreateFiles.write(i.toString() + '\r\n');
  });
}

module.exports = {
    uncaughtExceptionHandler
  };