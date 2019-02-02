const { gqml } = require("gqml");
const t = require("../utils/tablestore");
const _ = require("lodash");

gqml.yoga({
  typeDefs: `${__dirname}/danmaku.graphql`,
  resolvers: {
    Query: {
      GetDanmaku: async (p, { VideoID, StartTime }) => {
        let result = await t.client.getRange({
          tableName: "danmaku",
          direction: t.TableStore.Direction.FORWARD,
          inclusiveStartPrimaryKey: t.f({
            VideoID,
            Timestamp: t.Long.fromNumber(StartTime),
            UserID: ""
          }),
          exclusiveEndPrimaryKey: t.f({
            VideoID,
            Timestamp: t.Long.fromNumber(StartTime + 60000),
            UserID: ""
          }),
          limit: 100
        });
        result = _.chain(result.rows)
          .reduce((a = [], v, i) => {
            let obj = {};
            _.each(v.primaryKey, v => {
              obj[v.name] = v.value;
            });
            _.each(v.attributes, v => {
              obj[v.columnName] = v.columnValue;
            });
            a.push(obj);
            return a;
          }, [])
          .value();
        return result;
      }
    },
    Mutation: {
      SendDanmaku: async (p, { VideoID, Timestamp, UserID, text }) => {
        const result = await t.putRow({
          tableName: "danmaku",
          ...t.primaryKey({ VideoID, Timestamp: t.Long.fromNumber(Timestamp), UserID }),
          ...t.attributeColumns({ text })
        });
        return result;
      }
    }
  }
});
