import "./tweet";
import "./user";
import { gqml } from "gqml";
import { gql } from "../utils";

gqml.yoga({
  typeDefs: gql`
    scalar DateTime
    scalar JSON
  `
});
