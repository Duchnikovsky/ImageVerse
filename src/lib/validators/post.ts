import { z } from "zod";

export const PostValidator = z.object({
  image: z.string(),
  description: z
    .string()
    .min(3, { message: "Description must be longer than 3 characters" })
    .max(300, { message: "Description can't be longer than 300 characters" }),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
