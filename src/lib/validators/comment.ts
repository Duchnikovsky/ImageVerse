import { z } from "zod";

export const CommentValidator = z.object({
  postId: z.string(),
  commentValue: z.string().min(3).max(100),
});

export type CommentCreationRequest = z.infer<typeof CommentValidator>;
