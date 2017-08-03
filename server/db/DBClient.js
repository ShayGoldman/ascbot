const {overrideDefaults} = require('../utils/overrideDefaults');
const mysql              = require('mysql');

class DBClient {
  constructor(opts, logger) {
    const params = overrideDefaults({connectionLimit: 10}, opts);
    this.pool    = mysql.createPool(params);
    this.logger  = logger;
  }

  query(query, args) {
    return new Promise((resolve, reject) => {
      this._getConnection()
        .then((conn) => {
          const formatted = mysql.format(query, args);
          this.logger.debug(`Query: ${formatted}`);
          conn.query(formatted, (err, results) => {
            if (err) {
              conn.release();
              reject(err);
            }
            else resolve(results);
          })
        })
        .catch((err) => reject(err));
    });
  }

  _getConnection() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) reject(err);
        else resolve(connection);
      })
    });
  }
}

module.exports = DBClient;