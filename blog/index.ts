require("dotenv").config();
import "./modules";
import { gqml } from "gqml";
import { directiveResolvers } from "./utils";

const { PORT = 3000 } = process.env;

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
      port: PORT
    }
  });
