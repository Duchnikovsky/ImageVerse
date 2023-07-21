"use client";

import { User } from "next-auth";
import UserAvatar from "../UserAvatar";
import CSS from "@/styles/profile.module.css";
import FollowButton from "./FollowButton";

interface UserDataProps {
  user: Pick<User, "id" | "name" | "image" | "email">;
  postsCount: number;
  followers: number;
  followed: number;
  following: boolean;
}

export default function UserData({
  user,
  postsCount,
  followers,
  followed,
  following,
}: UserDataProps) {



  return (
    <div className={CSS.userData}>
      <div className={CSS.userAvatar}>
        <UserAvatar user={user} style="large" />
      </div>
      <div className={CSS.informations}>
        <div className={CSS.data}>
          <div className={CSS.name}>{user.name}</div>
          <FollowButton isFollowing={following} userId={user.id}/>
        </div>
        <div className={CSS.statistics}>
          <div>Posts: {postsCount}</div>
          <div>Followers: {followers}</div>
          <div>Following: {followed}</div>
        </div>
      </div>
    </div>
  );
}
