import { Role } from "@prisma/client";
import { type DefaultSession } from "next-auth";

export type ExtendeUser = DefaultSession["user"] & {
  role: Role;
};

declare module "next-auth" {
  interface Session {
    user: ExtendeUser;
  }
}
