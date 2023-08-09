"use client";

import CSS from "@/styles/home.module.css";
import { User } from "@prisma/client";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { startTransition } from "react";
import { toast } from "react-toastify";

interface SuggestedUserProps {
  user: User;
}

interface FollowPayload {
  userId: string;
}

export default function SuggestedUser({ user }: SuggestedUserProps) {
  const router = useRouter();

  const {
    mutate: follow,
    isLoading: isFollowLoading,
  } = useMutation({
    mutationFn: async () => {
      const payload: FollowPayload = {
        userId: user.id,
      };

      const { data } = await axios.post("/api/profile/follow", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
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

      return toast.error("An error occured", {
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
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast.success("Successfully followed user", {
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
  });

  return (
    <div className={CSS.proposedUser} key={user.id}>
      <Link href={`/profile/${user.id}`} className={CSS.userData}>
        <UserAvatar
          user={{ name: user.name, image: user.image }}
          style="small"
          key={user.id}
        />
        {user.name}
      </Link>
      <Button
        width="35%"
        height="1.5rem"
        fontSize="14px"
        isDisabled={false}
        isLoading={isFollowLoading}
        onClick={() => follow()}
      >
        Follow
      </Button>
    </div>
  );
}
