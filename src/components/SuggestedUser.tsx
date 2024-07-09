"use client";

import CSS from "@/styles/sidebar.module.scss";
import { User } from "@prisma/client";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/UI/Button";
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

async function followUser(user: User) {
  const payload: FollowPayload = {
    userId: user.id,
  };

  const { data } = await axios.post("/api/profile/follow", payload);
  return data as string;
}

export default function SuggestedUser({ user }: SuggestedUserProps) {
  const router = useRouter();

  const { mutate: follow, isPending: isFollowLoading } = useMutation({
    mutationFn: () => followUser(user),
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

  return (
    <div className={CSS.suggestedUser} key={user.id}>
      <Link href={`/profile/${user.id}`} className={CSS.user}>
        <UserAvatar
          user={{ name: user.name, image: user.image }}
          style="small"
          key={user.id}
        />
        <span className={CSS.name}>{user.name}</span>
      </Link>
      <Button
        width="35%"
        height="1.5rem"
        fontSize="14px"
        isLoading={isFollowLoading}
        onClick={() => follow()}
      >
        Follow
      </Button>
    </div>
  );
}
