"use client";
import CSS from "@/styles/profile.module.css";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface FollowButtonProps {
  isFollowing: boolean;
  userId: string;
}

interface FollowPayload {
  userId: string;
}

export default function FollowButton({
  isFollowing,
  userId,
}: FollowButtonProps) {
  const router = useRouter();

  const { mutate: follow, isLoading: isFollowLoading } = useMutation({
    mutationFn: async () => {
      const payload: FollowPayload = {
        userId,
      };

      const { data } = await axios.post("/api/profile/follow", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        //Toast
      }

      return console.log("not working"); // toast
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return console.log("worked"); //TOAST
    },
  });

  const { mutate: unfollow, isLoading: isUnfollowLoading } = useMutation({
    mutationFn: async () => {
      const payload: FollowPayload = {
        userId,
      };

      const { data } = await axios.post("/api/profile/unfollow", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        //Toast
      }

      return console.log("not working"); // toast
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return console.log("worked"); //TOAST
    },
  });

  return isFollowing ? (
    <button className={CSS.button} onClick={() => unfollow()}>{isUnfollowLoading ? <Loader2 className={CSS.loader}/> : 'Unfollow'}</button>
  ) : (
    <button className={CSS.button} onClick={() => follow()}>{isFollowLoading ? <Loader2 className={CSS.loader}/> : 'Follow'}</button>
  );
}
