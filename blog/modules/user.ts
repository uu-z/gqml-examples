import { gqml } from "gqml";
import { p, hashPwd, signToken, getTokenData, comparePwd, gql } from "../utils";

gqml.yoga({
  typeDefs: gql`
    type Query {
      me: User! @isAuthUser
    }
    type Mutation {
      signup(email: String!, name: String, password: String!): AuthPayload!
      login(email: String!, password: String!): AuthPayload!
    }

    type User {
      password: String @private
    }

    type AuthPayload {
      token: String
      user: User!
    }
  `,
  resolvers: {
    Query: {
      me: async (parent, args, ctx) => {
        const { userId } = getTokenData(ctx);
        return p.user({ id: userId });
      },
      users: async (parent, args, ctx) => {
        return p.users(args);
      }
    },
    Mutation: {
      signup: async (parent, { name, email, password }) => {
        const hashedPassword = await hashPwd(password);
        const user = await p.createUser({ name, email, password: hashedPassword });
        return {
          token: signToken(user),
          user
        };
      },
      login: async (parent, { email, password }) => {
        const user = await p.user({ email });
        if (!user) throw new Error(`No user found for email: ${email}`);
        const passwordValid = await comparePwd(password, user.password);
        if (!passwordValid) throw new Error("Invalid password");
        return {
          token: signToken(user),
          user
        };
      }
    },
    Subscription: {
      user: {
        subscribe: (parent, { where }) => {
          return p.$subscribe.user(where);
        },
        resolve: payload => {
          return payload;
        }
      }
    },
    User: {
      posts(parent, args) {
        return p.user({ id: parent.id }).posts();
      }
    }
  }
});
