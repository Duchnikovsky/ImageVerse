import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import Comment from "@/components/Comment/Comment";
import CSS from "@/styles/postDetails.module.css";
import { AlertCircle } from "lucide-react";

interface CommentSectionProps {
  postId: string;
}

export default async function CommentSection({ postId }: CommentSectionProps) {

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

  const commentsCount = await db.comment.count({
    where: {
      postId: postId,
      replyToId: null,
    },
  });

  return (
    <div>
      {commentsCount === 0 && <div className={CSS.noComments}>
        <AlertCircle size={40}/>
        There are no comments yet
        </div>}
      {comments
        .filter((comment) => !comment.replyToId)
        .map((topLevelComment) => {
          //VOTES

          return <Comment comment={topLevelComment} key={topLevelComment.id}/>;
        })}
    </div>
  );
}
