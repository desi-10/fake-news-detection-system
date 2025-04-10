import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { prisma } from "./utils/db";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
});
