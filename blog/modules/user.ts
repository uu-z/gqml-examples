import { gqml } from "gqml";
import { p, r, hashPwd, signToken, getUserId, comparePwd } from "../utils";

gqml.yoga({
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
    User: {
      posts(parent, args) {
        return p.user({ id: parent.id }).posts();
      }
    }
  }
});
