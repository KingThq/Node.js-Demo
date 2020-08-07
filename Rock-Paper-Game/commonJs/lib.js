exports.hello = 'word';

exports.add = function (a, b) {
  return a + b;
}

module.exports = function minus(a, b) {
  return a - b;
}

setTimeout(() => {
  console.log(exports);
  console.log(module.exports);
}, 2000);