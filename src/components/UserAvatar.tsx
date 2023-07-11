"use client"
import { User } from "next-auth";
import React from "react";
import * as Avatar from '@radix-ui/react-avatar';
import CSS from '@/styles/avatar.module.css';
import { Icons } from "./Icons";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps{
  user: Pick<User, "name" | "image">;
}

export default function UserAvatar({ user }: UserAvatarProps) {
  return <Avatar.Root className={CSS.AvatarRoot}>
    {user.image ? (
      <Avatar.Image
      className={CSS.AvatarImage}
      src={user.image}
      alt='profile picture'
      referrerPolicy="no-referrer"
      />
    ) : (
      <Avatar.Fallback className={CSS.AvatarFallback}>
        <Icons.user />
      </Avatar.Fallback>
    )}
  </Avatar.Root>;
}

{/* <Link href="/signIn"></Link> */}