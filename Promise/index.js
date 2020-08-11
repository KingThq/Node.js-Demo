(function () {
  function interview(name) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve('success');
        } else {
          const error = new Error();
          error.name = name;
          reject(error);
        }
      }, 500);
    });
  }

  Promise
    .all([
      interview('geektime'),
      interview('tencent')
    ])
    .then(() => {
      console.log('smile');
    })
    .catch(err => {
      console.log(`cry for ${err.name}`);
    })
})();