"use client";
import { ExtendedPost } from "@/types/db";
import CSS from "@/styles/feed.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import ProfilePost from "./ProfilePost";
import { Button } from "../Button";

interface ProfileFeedProps {
  userId: string;
}

export default function ProfileFeed({ userId }: ProfileFeedProps) {
  const { data, fetchNextPage, isFetching } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query = `/api/posts/profile?limit=6&page=${pageParam}&user=${userId}`;

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
      <div className={CSS.postsGrid}>
        {posts.map((post, index) => {
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
      <div className={CSS.loadPosts} onClick={() => fetchNextPage()}>
        <Button width="150px" height="30px" isDisabled={false} isLoading={isFetching} fontSize="18px">Load more</Button>
      </div>
    </div>
  );
}
