module.exports.debug = msg => {
  if (process.env.DEBUG) {
    process.stdout.write(msg);
  }
};

module.exports.debugln = msg => {
  if (process.env.DEBUG) {
    msg = 'debug: ' + msg + '\n';
    process.stdout.write(msg);
  }
};

module.exports.print = msg => {
  process.stdout.write(msg);
};

module.exports.println = msg => {
  msg += '\n';
  process.stdout.write(msg);
};
