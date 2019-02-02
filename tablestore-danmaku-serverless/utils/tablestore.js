const TableStore = require("tablestore");
const { Long } = TableStore;
const _ = require("lodash");

const { accessKeyId, secretAccessKey, stsToken, endpoint, instancename } = process.env;

const client = new TableStore.Client({
  accessKeyId,
  secretAccessKey,
  // stsToken,
  endpoint,
  instancename
});
const f = data =>
  _.chain(data)
    .map((v, k) => ({ [k]: v }))
    .value();

module.exports = {
  client,
  Long,
  TableStore,
  f,
  primaryKey: data => ({ primaryKey: f(data) }),
  attributeColumns: data => ({ attributeColumns: f(data) }),
  putRow: obj => {
    return client.putRow({
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      returnContent: { returnType: TableStore.ReturnType.Primarykey },
      ...obj
    });
  }
};
