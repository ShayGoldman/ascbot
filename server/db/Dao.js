const isEmpty = require('lodash/isEmpty');

class Dao {
  constructor(dbc, table, mapper) {
    this.dbc    = dbc;
    this.table  = table;
    this.mapper = mapper;
  }

  select(where) {
    const ands = getAndsForWhere(where);
    return Promise.resolve()
      .then(() => {
        if (ands.length === 0) {
          return this.dbc.query(`SELECT * FROM ??`, [this.table])
        } else {
          const whereFields = this._mapObjectToArray(where);
          return this.dbc.query(`SELECT * FROM ?? WHERE ?${ands}`, [this.table, ...whereFields])
        }
      })
      .then((results) => results.map((result) => this.mapper.mapFromDB(result)));
  }

  selectOne(where) {
    return Promise.resolve()
      .then(() => this.select(where))
      .then((results) => results[0]);
  }

  insert(item) {
    return this.dbc.query(`INSERT INTO ?? SET ?`, [this.table, this.mapper.mapToDB(item)])
  }

  update(where, set) {
    const ands = getAndsForWhere(where);
    return Promise.resolve()
      .then(() => this.selectOne(where))
      .then((item) => {
        if (!item) throw new Error("Cannot update");
        else {
          const newFields   = this.mapper.mapToDB(Object.assign({}, item, set));
          const whereFields = this._mapObjectToArray(where);
          return this.dbc.query(`UPDATE ?? SET ? WHERE ?${ands}`, [this.table, newFields, ...whereFields])
        }
      })
  }

  delete(where) {
    const ands = getAndsForWhere(where);
    if (ands.length === 0) throw new Error(`Cannot delete all data in ${this.table}`);
    else {
      const whereFields = this._mapObjectToArray(where);
      return this.dbc.query(`DELETE FROM ?? WHERE ?${ands}`, [this.table, ...whereFields])
    }
  }

  _mapObjectToArray(obj) {
    const mapped = this.mapper.mapToDB(obj);
    return Object.keys(mapped).reduce((out, key) => out.concat({[key]: mapped[key]}), []);
  }
}

function getAndsForWhere(where) {
  if (isEmpty(where)) return [];
  else return new Array(Object.keys(where).length - 1).fill(" AND ?").join("");
}


module.exports = Dao;