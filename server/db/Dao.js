const isEmpty                   = require('lodash/isEmpty');
const {requireSqlModulesAsText} = require('../../ops/db/requireSqlModulesAsText');
requireSqlModulesAsText();

class Dao {
  constructor(dbc, table, mapper, entity) {
    this.dbc    = dbc;
    this.table  = table;
    this.mapper = mapper;
    this.Entity = entity;
  }

  select(where) {
    return Promise.resolve()
      .then(() => {
        if (isEmpty(where)) {
          return this.dbc.query(`SELECT * FROM ??`, [this.table])
        } else {
          const ands        = getAndsForWhere(where);
          const whereFields = this._mapObjectToArray(where);
          return this.dbc.query(`SELECT * FROM ?? WHERE ?${ands}`, [this.table, ...whereFields])
        }
      })
      .then((results) => results.map((result) => new this.Entity(this.mapper.mapFromDB(result))));
  }

  selectOne(where) {
    return Promise.resolve()
      .then(() => this.select(where))
      .then((results) => results[0] || {});
  }

  insert(item) {
    const mapped = this.mapper.mapToDB(item);
    const keys   = Object.keys(mapped);
    const values = keys.reduce((out, key) => out.concat(mapped[key]), []);
    return this.dbc.query(`INSERT INTO ?? (?) VALUES (?)`, [this.table, keys, values]);
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