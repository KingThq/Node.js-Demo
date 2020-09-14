const fs = require('fs');
const protobuf = require('protocol-buffers');
const commentSchemas = protobuf(
  fs.readFileSync(`${__dirname}/../3.play/schema/comment.proto`)
);

const commentData = require('./mockdata/comment');

const server = require('./lib/geek-node-rpc-server')(commentSchemas.PraiseRequest, commentSchemas.PraiseResponse);

server
  .createServer((request, response) => {
    const commentid = request.body.commentid;
    const comment = commentData.filter(comment => comment.id === commentid)[0];
    let praiseNum = 0;

    if (comment) {
      comment.praiseNum++;
      praiseNum = comment.praiseNum;
    }
    response.end({
      commentid,
      praiseNum,
    });
  })
  .listen(4002, () => {
    console.log('rpc server listened 4002');
  });