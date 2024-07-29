"use client";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import CSS from "@/styles/PostfeedStyles/feed.module.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Post from "./Post";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";

interface PostFeedProps {
  session: Session | null;
  following: number;
}

export default function PostFeed({ session, following }: PostFeedProps) {
  const [mode, setMode] = useState<"forYou" | "popular">(
    session?.user ? "forYou" : "popular"
  );
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const [status, setStatus] = useState<string>("");

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["infinite-query", mode],
    queryFn: async ({ pageParam = 1 }) => {
      if (mode === "popular") {
        const query = `/api/posts/main/popular?limit=2&page=${pageParam}`;
        const { data } = await axios.get(query);
        const { posts, status } = data;
        setStatus(status);
        return { posts: posts as ExtendedPost[], status: status };
      } else {
        const query = `/api/posts/main/foryou?limit=2&page=${pageParam}`;
        const { data } = await axios.get(query);
        const { posts, status } = data;
        setStatus(status);
        return { posts: posts as ExtendedPost[], status: status };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialData: { pages: [], pageParams: [1] },
  });

  function handleModeChange(mode: string) {
    setMode(mode as "forYou" | "popular");
    refetch();
  }

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page.posts) || [] || [];

  return (
    <div className={CSS.feed}>
      <div className={CSS.select}>
        <span
          className={`${mode === "forYou" && `${CSS.active}`}`}
          onClick={() => {
            if (session?.user) handleModeChange("forYou");
          }}
        >
          For you
        </span>
        <span
          className={`${mode === "popular" && `${CSS.active}`}`}
          onClick={() => handleModeChange("popular")}
        >
          Popular feed
        </span>
      </div>
      <ul className={CSS.posts}>
        {!session?.user && (
          <li className={CSS.headerInfo}>
            Displaying the most popular posts
            <p>Sign in to view posts of followed users</p>
          </li>
        )}
        {status === "noPosts" && (
          <li className={CSS.headerInfo}>
            No posts from users you&apos;re following
            <p>Follow some users to see personalized feed</p>
          </li>
        )}
        {posts.map((post: ExtendedPost, index: number) => {
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
          if (index === posts.length - 1) {
            return (
              <li key={post.id} ref={ref} className={CSS.li}>
                <Post
                  post={post}
                  votesAmount={votesAmount}
                  currentVote={currentVote}
                  currentFavorite={currentFavorite}
                />
              </li>
            );
          } else {
            return (
              <Post
                post={post}
                votesAmount={votesAmount}
                currentVote={currentVote}
                currentFavorite={currentFavorite}
                key={post.id}
              />
            );
          }
        })}
        {(isFetchingNextPage || isLoading || isFetching) && (
          <li className={CSS.loader}>
            <Loader2 className={CSS.spin} />
          </li>
        )}
      </ul>
    </div>
  );
}
