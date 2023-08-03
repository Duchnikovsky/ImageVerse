import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import CSS from "@/styles/postDetails.module.css";
import Image from "next/image";
import UserAvatar from "@/components/UserAvatar";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import CommentSection from "@/components/Comment/CommentSection";
import CommentCreator from "@/components/Comment/CommentCreator";
import { getAuthSession } from "@/lib/auth";
import { formatTimeToNow } from "@/lib/utilities";
import PostVoteClient from "@/components/PostVoteClient";

interface pageProps {
  params: {
    postId: string;
  };
}

export default async function page({ params }: pageProps) {
  const session = await getAuthSession();

  const post = await db.post.findFirst({
    where: {
      id: params.postId,
    },
    include: {
      votes: true,
      author: true,
      favorite: true,
    },
  });

  if (!post) return notFound();

  const votesAmount = post.votes.reduce((acc, vote) => {
    if (vote.type === "UP") return acc + 1;
    if (vote.type === "DOWN") return acc - 1;
    return acc;
  }, 0);

  const currentVote = post.votes.find(
    (vote) => vote.userId === session?.user.id
  );

  let currentFavorite = undefined;

  if (post.favorite) {
    currentFavorite = post.favorite.find(
      (favorite) => favorite.userId === session?.user.id
    );
  }

  return (
    <div className={CSS.main}>
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
      <div className={CSS.dataArea}>
        <div className={CSS.commentsArea}>
          <div className={CSS.comment}>
            <UserAvatar user={post.author} style={"small"} />
            <div className={CSS.commentText}>
              <div>
                <Link href={`/profile/${post.author.id}`}>
                  <b>{post.author.name} </b>
                </Link>{" "}
                <b>•</b>{" "}
                <span className={CSS.date}>
                  {formatTimeToNow(new Date(post.createdAt))}
                </span>
              </div>{" "}
              {post.description}
            </div>
          </div>
          <hr className={CSS.hr2}></hr>
          <Suspense
            fallback={
              <div className={CSS.loadingArea}>
                <Loader2 className={CSS.loader} style={{ margin: "auto" }} />
              </div>
            }
          >
            <CommentSection postId={post.id} />
          </Suspense>
        </div>
        <hr className={CSS.hr3}></hr>
        <div className={CSS.votes}>
          <PostVoteClient
            postId={post.id}
            initialVotesAmount={votesAmount}
            initialVote={currentVote?.type}
            initialFavorite={currentFavorite}
          />
        </div>
        <hr className={CSS.hr2}></hr>
        <div className={CSS.creatorArea}>
          {session && session.user ? (
            <div>
              <CommentCreator
                postId={post.id}
                name={session.user.name!}
                image={session.user.image!}
              />
            </div>
          ) : (
            <div className={CSS.notAuthorized}>
              <div>You must sign in to comment</div>
              <AlertCircle size={32} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
