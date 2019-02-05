import { gqml } from "gqml";
import { p, r, hashPwd, signToken, getUserId, comparePwd, gql } from "../utils";

gqml.yoga({
  typeDefs: gql`
    type Query {
      me: User!
    }

    type Mutation {
      signup(email: String!, name: String, password: String!): AuthPayload!
      login(email: String!, password: String!): AuthPayload!
    }

    type AuthPayload {
      token: String!
      user: User!
    }

    type User {
      id: ID!
      createdAt: DateTime!
      updatedAt: DateTime!
      email: String!
      password: String!
      name: String
      tweets: [Tweet!]!
    }
  `,
  resolvers: {
    Query: {
      me: {
        shield: r.isAuthUser,
        resolve: async (parent, args, ctx) => {
          const userId = getUserId(ctx);
          return p.user({ id: userId });
        }
      }
    },
    Mutation: {
      signup: async (parent, { name, email, password }) => {
        const hashedPassword = await hashPwd(password);
        const user = await p.createUser({ name, email, password: hashedPassword });
        return {
          token: signToken({ userId: user.id }),
          user
        };
      },
      login: async (parent, { email, password }) => {
        const user = await p.user({ email });
        if (!user) throw new Error(`No user found for email: ${email}`);
        const passwordValid = await comparePwd(password, user.password);
        if (!passwordValid) throw new Error("Invalid password");
        return {
          token: signToken({ userId: user.id }),
          user
        };
      }
    },
    User: {}
  }
});
