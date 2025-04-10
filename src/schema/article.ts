import { z } from "zod";

export const articleSchema = z.object({
  content: z.union([z.string().nullish(), z.instanceof(File).nullish()]),
});
