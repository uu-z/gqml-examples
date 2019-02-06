import { rule } from "gqml";
import { getUserId, p } from "../utils";

export const rules = {
  isAuthUser: rule()((parent, args, ctx) => {
    const userId = getUserId(ctx);
    return Boolean(userId);
  }),
  isPostOwner: rule()(async (parent, { where }, ctx) => {
    const userId = getUserId(ctx);
    const author = await p.post(where).author();
    return userId == author.id;
  }),
  isAdmin: rule()(async (parnet, args, ctx) => {
    const userId = getUserId(ctx);
    const user = await p.user({ id: userId });
    return user.role == "ADMIN";
  })
};
