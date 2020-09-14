const protobuf = require('protocol-buffers');
const fs = require('fs');
const schemas = protobuf(fs.readFileSync(`${__dirname}/../schema/comment.proto`));

// 假数据
const listData = require('../../backend/mockdata/comment');
const RPC = require('../../backend/lib/rpc-server');

const server = new RPC({
  decodeRequest(buffer) {
    const seq = buffer.readInt32BE();

    return {
      seq,
      result: schemas.CommentListRequest.decode(buffer.slice(8)),
    }
  },
  isCompleteRequest(buffer) {
    const bodyLength = buffer.readInt32BE(4);

    return 8 + bodyLength;
  },
  encodeResponse(data, seq) {
    const body = schemas.CommentListResponse.encode(data);

    const head = Buffer.alloc(8);
    head.writeInt32BE(seq);
    head.writeInt32BE(body.length, 4);

    return Buffer.concat([head, body]);
  }
});

server
  .createServer((request, response) => {
    response.end(listData);
  })
  .listen(4001);