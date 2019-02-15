import { sign, verify } from "jsonwebtoken";
import { p, User } from "../utils";

interface TokenData {
  userId: string;
  role: string;
}

const { APP_SECRET = "appsecret1234" } = process.env;

export const signToken = (user: User): string => sign({ userId: user.id, role: user.role }, APP_SECRET);
export const verifyToken = (token: string): TokenData => verify(token, APP_SECRET);

export function getTokenData(ctx: any) {
  const Authorization = ctx.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const tokenData = verifyToken(token);
    return tokenData;
  } else {
    throw new Error("Authorization token required");
  }
}

export function getUser(ctx: any) {
  const { userId } = getTokenData(ctx);
  return p.user({ id: userId });
}
