import { VoteType } from "@prisma/client";

export type CachedPost = {
  id: string;
  image: string;
  description: string,
  author: string;
  currentVote: VoteType | null;
  createdAt: Date;
};
