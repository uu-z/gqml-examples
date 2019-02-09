import { hash, compare } from "bcrypt";
export { prisma as p } from "./generated/prisma-client";
export { rules as r } from "./permission";
export * from "./auth";
export const hashPwd = password => hash(password, 10);
export const comparePwd = (passwrod, hashPassword) => compare(passwrod, hashPassword);
export const gql = str => str;
