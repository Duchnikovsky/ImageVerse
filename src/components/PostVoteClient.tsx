"use client";

import { usePrevious } from "@mantine/hooks";
import { Favorite, VoteType } from "@prisma/client";
import { useEffect, useState } from "react";
import CSS from "@/styles/votes.module.css";
import { Heart, Star } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { PostVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

interface PostVoteClientProps {
  postId: string;
  initialVotesAmount: number;
  initialVote?: VoteType | null;
  initialFavorite: Pick<Favorite, 'userId'> | undefined
}

export default function PostVoteClient({
  postId,
  initialVotesAmount,
  initialVote,
  initialFavorite,
}: PostVoteClientProps) {
  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const [isFavorite, setFavorite] = useState<boolean>(false);
  const previousVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  useEffect(() => {
    if(initialFavorite){
      setFavorite(true)
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
          return toast.error(err.response?.data, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      }

      return toast.error('An error occured', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
      setFavorite(!isFavorite)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error(err.response?.data, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      }

      return toast.error('An error occured', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onMutate: () => {
      setFavorite(!isFavorite)
    },
  });

  return (
    <div className={CSS.main}>
      <div className={CSS.votes}>
        <Heart
          fill={currentVote === "UP" ? "#b00037" : "transparent"}
          className={CSS.heart}
          stroke="white"
          strokeWidth={"1.25px"}
          size={24}
          onClick={() => vote("UP")}
        />
        Upvotes count: {votesAmount}
      </div>
      <Star
        fill={isFavorite ? "#e0c21b" : "transparent"}
        className={CSS.star}
        stroke="white"
        strokeWidth={"1.25px"}
        size={24}
        onClick={() => favorite()}
      />
    </div>
  );
}
