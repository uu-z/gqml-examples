import "./modules";
import { gqml } from "gqml";

gqml.yoga({
  options: {
    context: ctx => ctx
  },
  listen: {
    port: 3000
  }
});
