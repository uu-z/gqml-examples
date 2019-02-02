const { gqml } = require("gqml");
const t = require("../utils/tablestore");
const { r } = require("../utils");

gqml.yoga({
  typeDefs: `${__dirname}/danmaku.graphql`,
  resolvers: {
    Query: {
      GetDanmaku: async (p, { player, time }) => {
        let result = await t.client.getRange({
          tableName: "danmaku",
          direction: t.TableStore.Direction.FORWARD,
          inclusiveStartPrimaryKey: t.f({
            player,
            author: "",
            time: t.Long.fromNumber(time)
          }),
          exclusiveEndPrimaryKey: t.f({
            player,
            author: "",
            time: t.Long.fromNumber(time + 60000)
          }),
          limit: 100
        });
        result = r(result.row);
        return result;
      }
    },
    Mutation: {
      SendDanmaku: async (p, { data }) => {
        const { player, time, author, ...other } = data;
        let result = await t.putRow({
          tableName: "danmaku",
          ...t.primaryKey({ player, author, time: t.Long.fromNumber(time) }),
          ...t.attributeColumns(other)
        });
        result = r(result.row);
        return result;
      }
    }
  }
});
