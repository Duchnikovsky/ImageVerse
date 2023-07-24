import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import Comment from "@/components/Comment/Comment";

interface CommentSectionProps {
  postId: string;
}

export default async function CommentSection({ postId }: CommentSectionProps) {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId: postId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  return (
    <div>
      {comments
        .filter((comment) => !comment.replyToId)
        .map((topLevelComment) => {
          //VOTES

          return <Comment comment={topLevelComment} />;
        })}
    </div>
  );
}
