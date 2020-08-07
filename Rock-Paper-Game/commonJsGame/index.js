// process.argv 可以记录用户输入的内容
var playerAction = process.argv[process.argv.length - 1];

const game = require('./lib');

let count = 0;

process.stdin.on('data', e => {
  const playerAction = e.toString().trim();

  const result = game(playerAction);
  if (result === -1) {
    count++;
  }
  if (count === 3) {
    console.log('不玩了，你太厉害了！');
    process.exit();
  }
});