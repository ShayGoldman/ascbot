const mysql = require('mysql');

const opts = {
  host: '',
  user: '',
  password: '',
  database: '',
  connectionLimit: 10
};

class DBClient {
  constructor() {
    this.pool = mysql.createPool(opts);
  }

  query(query, args) {
    return new Promise((resolve, reject) => {
      this._getConnection()
        .then((conn) => {
          const formatted = mysql.format(query, args);
          console.log("@@@ QUERY ", formatted)
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