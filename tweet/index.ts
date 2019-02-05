import "./modules";
import { gqml } from "gqml";

gqml.yoga({
  typeDefs: `${__dirname}/schema.graphql`,
  options: {
    context: ctx => ctx
  },
  listen: {
    port: 3000
  }
});
