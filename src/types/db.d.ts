import type { Post, User, Vote, Comment, Favorite } from '@prisma/client'

export type ExtendedComment = Comment & {
  author: User,
}

export type ExtendedPost = Post & {
  votes: Vote[]
  favorite: Favorite[]
  author: User
  comments: ExtendedComment[]
}