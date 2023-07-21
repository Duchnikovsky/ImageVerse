"use client";
import { Post, User, Vote } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import CSS from "@/styles/profilePost.module.css";
import { Heart } from "lucide-react";

interface ProfilePostProps {
  post: Post & {
    author: User;
    votes: Vote[];
  };
  votesAmount: number;
}

export default function ProfilePost({ post, votesAmount }: ProfilePostProps) {
  return (
    <div className={CSS.main} key={post.id}>
      <Link href={`/post/${post.id}`} className={CSS.imageArea}>
        <Image
          alt="image"
          src={post.image}
          fill={true}
          className={CSS.image}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        ></Image>
        <div className={CSS.hoverDiv}>
          <Heart stroke="#e8e8e8" fill="white"/>{votesAmount}
        </div>
      </Link>
    </div>
  );
}
