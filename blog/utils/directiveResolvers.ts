import { getTokenData, p } from "../utils";

const isRequestingUserAlsoOwner = ({ userId, type, typeId }) => p.$exists[type]({ id: typeId, author: { id: userId } });

export const directiveResolvers: any = {
  private(next, src, args, ctx) {
    return next().then(() => {
      return "******";
    });
  },
  isAuthUser(next, src, ars, ctx) {
    getTokenData(ctx);
    return next();
  },
  hasRole(next, src, { roles }, ctx) {
    const { role } = getTokenData(ctx);
    if (roles.includes(role)) {
      return next();
    }
    throw new Error("Unauthorized, incorrect role");
  },
  isOwner: async (next, src, { type }, ctx) => {
    const { userId } = getTokenData(ctx);
    const { id: typeId } = ctx.request.body.variables;
    const isOwner = type == "User" ? userId == typeId : await isRequestingUserAlsoOwner({ userId, type, typeId });
    if (isOwner) return next();
    throw new Error("Unauthorized, must be owner");
  },
  isOwnerOrHasRole: async (next, src, { roles, type }, ctx) => {
    const { userId, role } = getTokenData(ctx);
    if (roles.includes(role)) return next();
    const { id: typeId } = ctx.request.body.variables;
    const isOwner = await isRequestingUserAlsoOwner({ userId, type, typeId });
    if (isOwner) return next();
    throw new Error("Unauthorized, must be owner");
  }
};
