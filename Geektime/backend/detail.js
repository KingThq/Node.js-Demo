const fs = require('fs');
const protobuf = require('protocol-buffers');
const schemas = protobuf(fs.readFileSync(`${__dirname}/../2.detail/detail.proto`));

const columnData = require('./mockdata/column');

/**
 * 服务端的编解包逻辑
 */
const server = require('./lib/geek-node-rpc-server')(schemas.ColumnRequest, schemas.ColumnResponse);

server
  .createServer((request, response) => {
    const columnid = request.body;

    response.end({
      column: columnData[0],
      recommendColumns: [columnData[1], columnData[2]],
    });
  })
  .listen(4000, () => {
    console.log('rpc server listened: 4000');
  });