const _ = require("lodash");

const parse = v => {
  let obj = {};
  _.each(v.primaryKey, v => {
    obj[v.name] = v.value;
  });
  _.each(v.attributes, v => {
    obj[v.columnName] = v.columnValue;
  });
  return obj;
};

module.exports = {
  r: data => {
    if (_.isArray(data)) {
      return _.chain(data)
        .reduce((a = [], v, i) => {
          a.push(parse(v));
          return a;
        }, [])
        .value();
    } else {
      return parse(data);
    }
  }
};
