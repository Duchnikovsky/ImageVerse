"use client"
import { formatTimeToNow } from "@/lib/utilities";
import CSS from "@/styles/post.module.css";
import { Post, User, Vote } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";
import PostVoteClient from "../PostVoteClient";

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  post: Post & {
    author: User;
    votes: Vote[];
  };
  votesAmount: number,
  currentVote?: PartialVote
}

export default function Post({ post, votesAmount, currentVote }: PostProps) {
  return (
    <div className={CSS.main} key={post.id}>
      <div className={CSS.data}>
        Posted by:{" "}
        <Link href={`/profile/${post.author.id}`}>
          <b>{post.author.name}</b>
        </Link>{" "}
        <b>•</b> {formatTimeToNow(new Date(post.createdAt))}
      </div>
      <div className={CSS.imageArea}>
        <Image
          alt="image"
          src={post.image}
          fill={true}
          className={CSS.image}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        ></Image>
      </div>
      <PostVoteClient postId={post.id} initialVotesAmount={votesAmount} initialVote={currentVote?.type}/>
      <div className={CSS.post}>
        <Link href={`/profile/${post.author.id}`}>
          <b>{post.author.name}</b>
        </Link>
        : {post.description}
      </div>
      <div className={CSS.comment}>
        <TextareaAutosize
          placeholder="Post your comment"
          className={CSS.comment}
          spellCheck="false"
          maxLength={200}
        />
      </div>
      <hr className={CSS.hr}></hr>
    </div>
  );
}
