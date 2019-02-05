import { sign, verify } from "jsonwebtoken";

interface TokenData {
  userId: string;
}

const { APP_SECRET = "appsecret1234" } = process.env;

export const signToken = (data: TokenData): string => sign(data, APP_SECRET);
export const verifyToken = (token: string): TokenData => verify(token, APP_SECRET);

export function getUserId(context: any) {
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const tokenData = verifyToken(token);
    return tokenData && tokenData.userId;
  } else {
    throw new Error("Authorization token required");
  }
}
