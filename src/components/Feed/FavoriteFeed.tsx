"use client";

import { ExtendedPost } from "@/types/db";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import CSS from "@/styles/ProfileStyles/profileFeed.module.scss";
import { toast } from "react-toastify";
import { BiCameraOff } from "react-icons/bi";
import ProfilePost from "../Profile/ProfilePost";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";

export default function FavoriteFeed({ userId }: { userId: string }) {
  const session = useSession();

  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const {
    data,
    fetchNextPage,
    isFetched,
  } = useInfiniteQuery({
    queryKey: ["infinite-favorite-query"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const query = `/api/posts/favorite?limit=6&page=${pageParam}&user=${userId}`;
        const { data } = await axios.get(query);
        return data as ExtendedPost[];
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data);
        }
      }
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
      {session.data?.user.id === userId && (
        <div className={CSS.header}>Displaying user's favorite posts</div>
      )}
      {isFetched && posts.length < 1 && session.data?.user.id === userId && (
        <div className={CSS.noPosts}>
          <BiCameraOff size={64} />
          This user haven&apos;t posted any photos yet
        </div>
      )}
      {posts.map((post, index: number) => {
        if (!post) return null;
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
