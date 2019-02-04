import { rule } from "gqml";
import { getUserId, p } from "../utils";

export const rules = {
  isAuthUser: rule()((parent, args, ctx) => {
    const userId = getUserId(ctx);
    return Boolean(userId);
  }),
  isPostOwner: rule()(async (parent, { id }, ctx) => {
    const userId = getUserId(ctx);
    const author = await p.post({ id }).author();
    return userId == author.id;
  })
};
