const liseClient = require('./list-client');

module.exports = async function (sortType = 0, filtType = 0) {
  // 使用微服务拉取数据
  const data = await new Promise((resolve, reject) => {
    liseClient.write({
      sortType,
      filtType,
    }, (err, res) => {
      err ? reject(err) : resolve(res.columns);
    })
  });

  return data;
}