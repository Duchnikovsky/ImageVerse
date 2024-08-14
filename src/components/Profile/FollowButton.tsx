"use client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { toast } from "react-toastify";

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

  const { mutate: follow, isPending: isFollowLoading } = useMutation({
    mutationFn: async () => {
      const payload: FollowPayload = {
        userId,
      };

      const { data } = await axios.post("/api/profile/follow", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data);
      }

      return toast.error("An error occured");
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast.success("Successfully followed user");
    },
  });

  const { mutate: unfollow, isPending: isUnfollowLoading } = useMutation({
    mutationFn: async () => {
      const payload: FollowPayload = {
        userId,
      };

      const { data } = await axios.post("/api/profile/unfollow", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data);
      }

      return toast.error("An error occured");
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast.info("Successfully unfollowed user");
    },
  });

  return isFollowing ? (
    <Button
      width="8rem"
      height="2rem"
      isLoading={isFollowLoading}
      isDisabled={false}
      margin={"0 0 0 1rem"}
      onClick={() => unfollow()}
    >
      Unfollow
    </Button>
  ) : (
    <Button
      width="8rem"
      height="2rem"
      isLoading={isFollowLoading}
      isDisabled={false}
      onClick={() => follow()}
      margin={"0 0 0 1rem"}
    >
      Follow
    </Button>
  );
}
