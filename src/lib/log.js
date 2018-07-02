module.exports.debug = msg => {
  if (process.env.DEBUG === 'true') {
    process.stdout.write(msg);
  }
};

module.exports.debugln = msg => {
  if (process.env.DEBUG === 'true') {
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
