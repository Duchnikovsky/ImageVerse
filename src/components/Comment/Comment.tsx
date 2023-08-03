"use client";
import CSS from "@/styles/postDetails.module.css";
import { Comment, CommentVote, User } from "@prisma/client";
import { useRef } from "react";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { formatTimeToNow } from "@/lib/utilities";

type ExtendedCommand = Comment & {
  votes: CommentVote[];
  author: User;
};

interface CommentProps {
  comment: ExtendedCommand;
}

export default function Comment({ comment }: CommentProps) {
  const commentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={CSS.comment} ref={commentRef}>
      <UserAvatar user={comment.author} style={"small"} />
      <div className={CSS.commentText}>
        <div>
          <Link href={`/profile/${comment.author.id}`}>
            <b>{comment.author.name} </b>
          </Link>{" "}
          <b>•</b>{" "}
          <span className={CSS.date}>
            {formatTimeToNow(new Date(comment.createdAt))}
          </span>
        </div>
        {comment.text}
      </div>
    </div>
  );
}
