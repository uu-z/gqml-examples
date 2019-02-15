require("dotenv").config();
import "./modules";
import { gqml } from "gqml";
import { directiveResolvers } from "./utils";

gqml
  .yoga({
    typeDefs: __dirname + "/utils/generated/prisma.graphql"
  })
  .yoga({
    typeDefs: __dirname + "/schema.graphql",
    options: {
      context: ctx => ctx,
      directiveResolvers
    },
    listen: {
      port: 3000
    }
  });
