export * from "./generated/prisma-client/index";
import { hash, compare } from "bcryptjs";
export { prisma as p } from "./generated/prisma-client";
export * from "./auth";
export * from "./directiveResolvers";
export const hashPwd = password => hash(password, 10);
export const comparePwd = (passwrod, hashPassword) => compare(passwrod, hashPassword);
export const gql = str => str;
