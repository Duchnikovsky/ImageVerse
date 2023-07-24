import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import CSS from "@/styles/postDetails.module.css";
import Image from "next/image";
import UserAvatar from "@/components/UserAvatar";
import { Loader2, Pen } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import CommentSection from "@/components/Comment/CommentSection";
import CommentCreator from "@/components/Comment/CommentCreator";
import { getAuthSession } from "@/lib/auth";

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
    },
  });

  if (!post) return notFound();

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
              <Link href={`/profile/${post.author.id}`}>
                <b style={{ color: "#1d1d1d" }}>{post.author.name} </b>
              </Link>{" "}
              <Pen size={14} /> {post.description}
            </div>
          </div>
          <hr className={CSS.hr}></hr>
          <Suspense fallback={<Loader2 className={CSS.loader} />}>
            <CommentSection postId={post.id} />
          </Suspense>
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
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
