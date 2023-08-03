"use client";
import CSS from "@/styles/profile.module.css";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/Button";

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
    <Button
      width="90%"
      height="2rem"
      isLoading={isUnfollowLoading}
      fontSize="18px"
      isDisabled={false}
      margin={"auto"}
      onClick={() => unfollow()}
    >
      Unfollow
    </Button>
  ) : (
    <Button
      width="90%"
      height="2rem"
      isLoading={isFollowLoading}
      fontSize="18px"
      isDisabled={false}
      margin={"auto"}
      onClick={() => follow()}
    >
      Follow
    </Button>
  );
}
