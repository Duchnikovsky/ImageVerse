"use client"
import { User } from "next-auth";
import React from "react";
import * as Avatar from '@radix-ui/react-avatar';
import CSS from '@/styles/avatar.module.css';
import { Icons } from "./Icons";

interface UserAvatarProps{
  user: Pick<User, "name" | "image">,
  style: string,
}

export default function UserAvatar({ user, style }: UserAvatarProps) {
  return <Avatar.Root className={style === 'large' ? CSS.AvatarRootLarge : (style === 'small' ? CSS.AvatarRootSmall : CSS.AvatarRoot)}>
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
