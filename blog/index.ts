import "./modules";
import { gqml } from "gqml";

gqml.yoga({
  typeDefs: `${__dirname}/schema.graphql`,
  listen: {
    port: 3000
  }
});
