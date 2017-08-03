class DBMapper {
  constructor(mapping) {
    this.mapping = mapping;
  }

  mapToDB(item) {
    return Object.keys(this.mapping).reduce((out, dbColumnName) => {
      const fieldName  = this.mapping[dbColumnName];
      const fieldValue = item[fieldName];
      return Object.assign({}, out, {[dbColumnName]: fieldValue});
    }, {});
  }

  mapFromDB(result) {
    return Object.keys(this.mapping).reduce((out, dbColumnName) => {
      const fieldName  = this.mapping[dbColumnName];
      const fieldValue = result[dbColumnName];
      return Object.assign({}, out, {[fieldName]: fieldValue});
    }, {});
  }
}

module.exports = DBMapper;