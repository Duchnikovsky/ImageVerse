"use client";
import CSS from "@/styles/postDetails.module.css";
import { Comment, CommentVote, User } from "@prisma/client";
import { useRef } from "react";
import UserAvatar from "../UserAvatar";
import Link from "next/link";

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
        <Link href={`/profile/${comment.author.id}`}>
          <b style={{ color: "#1d1d1d" }}>{comment.author.name} </b>
        </Link>{" "}
        {comment.text}
      </div>
    </div>
  );
}
