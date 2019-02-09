import { rule } from "gqml";
import { getUserId, p } from "../utils";

export const rules = {
  isAuthUser: rule()((parent, args, ctx) => {
    const userId = getUserId(ctx);
    return Boolean(userId);
  }),
  isAdmin: rule()(async (parnet, args, ctx) => {
    const userId = getUserId(ctx);
    const user = await p.user({ id: userId });
    return user.role == "ADMIN";
  })
};