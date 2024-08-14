"use client";
import { ExtendedPost } from "@/types/db";
import CSS from "@/styles/ProfileStyles/profileFeed.module.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { BiCameraOff } from "react-icons/bi";
import ProfilePost from "./ProfilePost";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";

interface ProfileFeedProps {
  userId: string;
}

export default function ProfileFeed({ userId }: ProfileFeedProps) {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetched } = useInfiniteQuery({
    queryKey: [`infinite-profile${userId}-query`],
    queryFn: async ({ pageParam = 1 }) => {
      const query = `/api/posts/profile?limit=6&page=${pageParam}&user=${userId}`;
      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    initialPageParam: 1,
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialData: { pages: [], pageParams: [1] },
    refetchOnWindowFocus: false,
  });

  const posts = data?.pages.flatMap((page) => page) || [];

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div className={CSS.imageGrid}>
      {isFetched && posts.length < 1 && (
        <div className={CSS.noPosts}>
          <BiCameraOff size={64} />
          This user haven&apos;t posted any photos yet
        </div>
      )}
      {posts.map((post, index: number) => {
        const votesAmount = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);
        if (index === posts.length - 1) {
          return (
            <div key={post.id} ref={ref}>
              <ProfilePost
                key={post.id}
                post={post}
                votesAmount={votesAmount}
              />
            </div>
          );
        } else {
          return (
            <ProfilePost key={post.id} post={post} votesAmount={votesAmount} />
          );
        }
      })}
    </div>
  );
}
