/**
 *
 * @param func: (handleFunc: (err, data) => any) => any
 * @returns {Promise}
 */
function promisify(func) {
  return new Promise((resolve, reject) => {
    const handle = (err, data) => {
      if (err) reject(err);
      else resolve(data);
    };

    return func(handle);
  });
}

module.exports = {
  promisify
};
