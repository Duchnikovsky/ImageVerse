"use client";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useRef } from "react";
import CSS from "@/styles/feed.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "./Post";
import { Loader2 } from "lucide-react";

export default function PostFeed() {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage, isLoading, isFetching } =
    useInfiniteQuery(
      ["infinite-query"],
      async ({ pageParam = 1 }) => {
        const query = `/api/posts/main?limit=2&page=${pageParam}`;

        const { data } = await axios.get(query);
        return data as ExtendedPost[];
      },
      {
        getNextPageParam: (_, pages) => {
          return pages.length + 1;
        },
        initialData: { pages: [], pageParams: [1] },
      }
    );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) || [];

  return (
    <ul className={CSS.ul}>
      {posts.map((post, index) => {
        const votesAmount = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );
        
        let currentFavorite = undefined

        if(post.favorite){
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
        <li className={CSS.loading}>
          <Loader2 className={CSS.loader} />
        </li>
      )}
    </ul>
  );
}
