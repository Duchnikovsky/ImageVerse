"use client";
import { User } from "next-auth";
import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import CSS from "@/styles/avatar.module.scss";
import { Icons } from "./Icons";

interface UserAvatarProps {
  user: Pick<User, "name" | "image">;
  style: string;
}

export default function UserAvatar({ user, style }: UserAvatarProps) {
  return (
    <Avatar.Root
      className={
        style === "large"
          ? CSS.large
          : style === "small"
          ? CSS.small
          : CSS.default
      }
    >
      {user.image ? (
        <Avatar.Image
          className={CSS.image}
          src={user.image}
          alt="profile picture"
          referrerPolicy="no-referrer"
        />
      ) : (
        <Avatar.Fallback className={CSS.fallback}>
          <Icons.user />
        </Avatar.Fallback>
      )}
    </Avatar.Root>
  );
}
