require("./.env");
require("./modules");
const { gqml } = require("gqml");

gqml.yoga({
  listen: {
    port: 8001
  }
});
