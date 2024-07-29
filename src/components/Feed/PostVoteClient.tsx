"use client";

import { usePrevious } from "@mantine/hooks";
import { Favorite, VoteType } from "@prisma/client";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import CSS from "@/styles/PostfeedStyles/vote.module.scss";
import { Heart, Star } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { PostVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

interface PostVoteClientProps {
  postId: string;
  initialVotesAmount: number;
  initialVote?: VoteType | null;
  initialFavorite: Pick<Favorite, "userId"> | undefined;
}

const PostVoteClient = forwardRef(
  (
    {
      postId,
      initialVotesAmount,
      initialVote,
      initialFavorite,
    }: PostVoteClientProps,
    ref
  ) => {
    const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount);
    const [currentVote, setCurrentVote] = useState(initialVote);
    const [isFavorite, setFavorite] = useState<boolean>(false);
    const previousVote = usePrevious(currentVote);

    useEffect(() => {
      setCurrentVote(initialVote);
    }, [initialVote]);

    useEffect(() => {
      if (initialFavorite) {
        setFavorite(true);
      }
    }, [initialFavorite]);

    const { mutate: vote } = useMutation({
      mutationFn: async (type: VoteType) => {
        const payload: PostVoteRequest = {
          voteType: type,
          postId: postId,
        };

        await axios.patch("/api/post/vote", payload);
      },
      onError: (err, voteType) => {
        if (voteType === "UP") setVotesAmount((prev) => prev - 1);
        else setVotesAmount((prev) => prev + 1);
        setCurrentVote(previousVote);

        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            return toast.error(err.response?.data);
          }
        }

        return toast.error("An error occured");
      },
      onMutate: (type: VoteType) => {
        if (currentVote === type) {
          setCurrentVote(undefined);
          if (type === "UP") setVotesAmount((prev) => prev - 1);
          else if (type === "DOWN") setVotesAmount((prev) => prev + 1);
        } else {
          setCurrentVote(type);
          if (type === "UP")
            setVotesAmount((prev) => prev + (currentVote ? 2 : 1));
          else if (type === "DOWN")
            setVotesAmount((prev) => prev - (currentVote ? 2 : 1));
        }
      },
    });

    const { mutate: favorite } = useMutation({
      mutationFn: async () => {
        const payload = {
          postId: postId,
        };

        await axios.patch("/api/post/favorite", payload);
      },
      onError: (err) => {
        setFavorite(!isFavorite);

        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            return toast.error(err.response?.data);
          }
        }

        return toast.error("An error occured");
      },
      onMutate: () => {
        setFavorite(!isFavorite);
      },
    });

    useImperativeHandle(ref, () => ({
      vote: (type: VoteType) => vote(type),
      favorite: () => favorite(),
    }));

    return (
      <div className={CSS.interactions}>
        <Heart
          id="heart"
          className={`${CSS.icon} ${CSS.heart} ${
            currentVote === "UP" && CSS.active
          }`}
          strokeWidth={"1px"}
          onClick={() => vote("UP")}
        />
        <div className={CSS.voteAmount}>
          {votesAmount}
          <span>Upvotes</span>
        </div>
        <Star
          className={`${CSS.icon} ${CSS.star} ${isFavorite && CSS.active}`}
          strokeWidth={"1px"}
          onClick={() => favorite()}
        />
      </div>
    );
  }
);

export default PostVoteClient;
