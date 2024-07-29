"use client";
import { formatTimeToNow } from "@/lib/utilities";
import CSS from "@/styles/PostfeedStyles/post.module.scss";
import { Favorite, Vote } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import PostVoteClient from "./PostVoteClient";
import UserAvatar from "../UserAvatar";
import { useRef } from "react";
import { ExtendedPost } from "@/types/db";
import CommentsSection from "../Comment/CommentsSection";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  post: ExtendedPost;
  votesAmount: number;
  currentVote?: PartialVote;
  currentFavorite?: Pick<Favorite, "userId">;
}

export default function Post({
  post,
  votesAmount,
  currentVote,
  currentFavorite,
}: PostProps) {
  const actionRef = useRef<any>(null);

  return (
    <div className={CSS.post} key={post.id}>
      <div className={CSS.user}>
        <div className={CSS.avatar}>
          <UserAvatar
            user={{ name: post.author.name, image: post.author.image }}
            style="medium"
          />
        </div>
        <div className={CSS.author}>
          <Link href={`/profile/${post.author.id}`}>{post.author.name}</Link>{" "}
          <b>•</b>
          <span>{formatTimeToNow(new Date(post.createdAt))}</span>
        </div>
      </div>
      <div
        className={CSS.content}
        onDoubleClick={() => actionRef.current.vote("UP")}
      >
        <Image
          alt="image"
          src={post.image}
          fill={true}
          className={CSS.image}
          loading="lazy"
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        ></Image>
      </div>
      <PostVoteClient
        postId={post.id}
        initialVotesAmount={votesAmount}
        initialVote={currentVote?.type}
        initialFavorite={currentFavorite}
        ref={actionRef}
      />
      <CommentsSection post={post} />
    </div>
  );
}
