import "./modules";
import { gqml } from "gqml";

gqml.yoga({
  typeDefs: `${__dirname}/utils/generated/prisma.graphql`,
  options: {
    context: ctx => ctx
  },
  listen: {
    port: 3000
  }
});
