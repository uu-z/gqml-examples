import { sign, verify } from "jsonwebtoken";
import { p } from "../utils";

interface TokenData {
  userId: string;
}

const { APP_SECRET = "appsecret1234" } = process.env;

export const signToken = (data: TokenData): string => sign(data, APP_SECRET);
export const verifyToken = (token: string): TokenData => verify(token, APP_SECRET);

export function getUserId(ctx: any) {
  const Authorization = ctx.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const tokenData = verifyToken(token);
    return tokenData && tokenData.userId;
  } else {
    throw new Error("Authorization token required");
  }
}

export function getUser(ctx: any) {
  const userId = getUserId(ctx);
  return p.user({ id: userId });
}
