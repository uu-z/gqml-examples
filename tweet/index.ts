import "./modules";
import "gqml/plugins/voyager";
import { gqml } from "gqml";

gqml.yoga({
  typeDefs: `${__dirname}/schema.graphql`,
  options: {
    context: ctx => ctx,
    directiveResolvers: {
      private: (next, src, args, ctx) => {
        return next().then(val => {
          return null;
        });
      }
    }
  },
  voyager: {
    endpoint: "/voyager",
    options: {
      endpointUrl: "/"
    }
  },
  listen: {
    port: 3000
  }
});
