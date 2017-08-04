const sqlite3 = require('sqlite3').verbose();
const mysql   = require('mysql');
const Logger = require('../server/Logger');

class InMemoryDb {

  constructor(sql) {
    this.db  = new sqlite3.Database(':memory:');
    this.sql = sql;
    this.logger = new Logger({debugOn: true});
  }


  reset() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else {
          this.db = new sqlite3.Database(':memory:');
          resolve();
        };
      })
    })
  }

  setup() {
    return new Promise((resolve, reject) => {
      const _setup = (sql = []) => {
        if (sql.length === 0) resolve();
        else {
          const [stmt, ...rest] = sql;
          this.logger.debug(stmt);
          this.db.run(stmt, (err, res) => {
            if (err) reject(err);
            else _setup(rest);
          })
        }
      };
      _setup(this.sql);
    })
  }


  query(query = "", args) {
    return new Promise((resolve, reject) => {
      const isSelectQuery = query.toUpperCase().startsWith("SELECT");
      const formatted     = mysql.format(query, args);
      this.logger.debug(formatted);
      const handlePromise = (err, res) => {
        if (err) reject(err);
        else resolve(res);
      };
      if (isSelectQuery) {
        this.db.all(formatted, handlePromise);
      } else {
        this.db.run(formatted, handlePromise);
      }
    });
  }
}


module.exports = InMemoryDb;