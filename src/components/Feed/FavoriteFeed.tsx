"use client";

import CSS from "@/styles/favorites.module.css";
import { ExtendedPost } from "@/types/db";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "../Button";
import ProfilePost from "../Profile/ProfilePost";
import { AlertCircle } from "lucide-react";

export default function FavoriteFeed() {
  const { data, fetchNextPage, isFetching, isFetched } = useInfiniteQuery(
    ["infinite-favorite-query"],
    async ({ pageParam = 1 }) => {
      const query = `/api/posts/favorite?limit=6&page=${pageParam}`;

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

  const posts = data?.pages.flatMap((page) => page) || [];

  return (
    <div className={CSS.main}>
      <div className={CSS.header}>Your favorite posts</div>
      {isFetched && posts.length < 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <AlertCircle size={48} /> You haven't favorized any post yet
        </div>
      )}
      <div className={CSS.postsGrid}>
        {posts.map((post) => {
          const votesAmount = post.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1;
            if (vote.type === "DOWN") return acc - 1;
            return acc;
          }, 0);
          return (
            <ProfilePost post={post} votesAmount={votesAmount} key={post.id} />
          );
        })}
      </div>
      {(isFetched && posts.length < 1) || (
        <div className={CSS.loadPosts} onClick={() => fetchNextPage()}>
          <Button
            width="150px"
            height="30px"
            isDisabled={false}
            isLoading={isFetching}
            fontSize="18px"
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
