"use client";
import { formatTimeToNow } from "@/lib/utilities";
import CSS from "@/styles/post.module.css";
import { Favorite, Post, User, Vote } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";
import PostVoteClient from "../PostVoteClient";
import UserAvatar from "../UserAvatar";
import { useState } from "react";
import { Button } from "../Button";
import { CommentCreationRequest } from "@/lib/validators/comment";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import FeedComment from "../Comment/FeedComment";
import { ExtendedComment } from "@/types/db";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  post: Post & {
    author: User;
    comments: ExtendedComment[];
    votes: Vote[];
  };
  votesAmount: number;
  currentVote?: PartialVote;
  currentFavorite?: Pick<Favorite, "userId">
}

export default function Post({ post, votesAmount, currentVote, currentFavorite }: PostProps) {
  const [value, setValue] = useState<string>("");
  const router = useRouter();

  const {
    mutate: comment,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async ({ postId, commentValue }: CommentCreationRequest) => {
      const payload: CommentCreationRequest = {
        postId,
        commentValue: commentValue,
      };

      const { data } = await axios.patch(`/api/post/comment`, payload);

      return data;
    },
    onError: (err) => {
      //TOAST
    },
    onSuccess: () => {
      router.refresh();
      setValue("");
    },
  });

  return (
    <div className={CSS.main} key={post.id}>
      <div className={CSS.data}>
        <div className={CSS.avatarArea}>
          <UserAvatar
            user={{ name: post.author.name, image: post.author.image }}
            style="small"
          />
        </div>
        <div className={CSS.authorArea}>
          <Link href={`/profile/${post.author.id}`}>{post.author.name}</Link>{" "}
          <b>•</b>
          <span className={CSS.date}>
            {formatTimeToNow(new Date(post.createdAt))}
          </span>
        </div>
      </div>
      <Link href={`/post/${post.id}`} className={CSS.imageArea}>
        <Image
          alt="image"
          src={post.image}
          fill={true}
          className={CSS.image}
          loading="lazy"
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        ></Image>
      </Link>
      <div className={CSS.voteArea}>
        <PostVoteClient
          postId={post.id}
          initialVotesAmount={votesAmount}
          initialVote={currentVote?.type}
          initialFavorite={currentFavorite}
        />
      </div>
      <div className={CSS.post}>
        <Link href={`/profile/${post.author.id}`}>
          <b>{post.author.name}</b>
        </Link>
        : {post.description}
      </div>
      <div className={CSS.comments}>
        <FeedComment comments={post.comments} />
      </div>
      {isSuccess ? (
        <div className={CSS.commentSuccess}>
          <CheckCircle size={17} /> Successfully posted comment
        </div>
      ) : (
        <div className={CSS.comment}>
          <TextareaAutosize
            placeholder="Post your comment"
            className={CSS.comment}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            spellCheck="false"
            maxLength={200}
          />
        </div>
      )}
      {value.length > 2 && (
        <div className={CSS.commentPostArea}>
          <Button
            width="25%"
            height="1.75rem"
            fontSize="16px"
            isLoading={isLoading}
            isDisabled={!(value.length > 2)}
            onClick={() => comment({ postId: post.id, commentValue: value })}
          >
            Post
          </Button>
        </div>
      )}
    </div>
  );
}
