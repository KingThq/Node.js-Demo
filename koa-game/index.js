const fs = require('fs');
const game = require('./game');
const koa = require('koa');
const mount = require('koa-mount');

// 玩家胜利次数，如果超过3，则后续往该服务器的请求都返回500
var playerWinCount = 0
// 玩家的上一次游戏动作
var lastPlayerAction = null;
// 玩家连续出同一个动作的次数
var sameCount = 0;

const app = new koa();

app.use(mount('/favicon.ico', (ctx) => {
  // console.log(ctx);
  ctx.status = 200;
}));

const gameKoa = new koa();
app.use(mount('/game', gameKoa));

gameKoa.use(async (ctx, next) => {
  if (playerWinCount >= 3) {
    ctx.status = 500;
    ctx.body = '我不玩了！';
    return;
  }

  // 使用await 关键字等待后续中间件执行完成
  await next();

  if (ctx.playerWon) {
    playerWinCount++;
  }
});

gameKoa.use(async (ctx, next) => {
  const query = ctx.query;
  const playerAction = query.action;
  if (!playerAction) {
    ctx.status = 400;
    return;
  }
  if (sameCount == 9) {
    ctx.status = 500;
    ctx.body = '我不玩了！';
  }

  if (lastPlayerAction == playerAction) {
    sameCount++;
    if (sameCount >= 3) {
      ctx.status = 400;
      ctx.body = '你作弊！';
      sameCount = 9;
      return;
    }
  } else {
    sameCount = 0;
  }

  lastPlayerAction = playerAction;
  ctx.playerAction = playerAction;
  await next();
});

gameKoa.use(async (ctx, next) => {
  const playerAction = ctx.playerAction;
  const result = game(playerAction);

  // 对于一定需要在请求主流程里完成的操作，一定要使用await进行等待
  // 否则koa就会在当前事件循环就把http response返回出去了
  await new Promise(resolve => {
    setTimeout(() => {
      ctx.status = 200;
      if (result == 0) {
        ctx.body = '平局'

      } else if (result == -1) {
          ctx.body = '你输了'

      } else {
          ctx.body = '你赢了'
          ctx.playerWon = true;

      }
      resolve();
    }, 500);
  })
});

app.use(mount('/', (ctx) => {
  ctx.body = fs.readFileSync(__dirname + '/index.html', 'utf-8');
}));

app.listen(3000);
