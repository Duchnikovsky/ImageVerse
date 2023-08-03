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
      <UserAvatar user={user} style="large" />
      <div className={CSS.name}>{user.name}</div>
      <div className={CSS.statistics}>
        <div className={CSS.statistic}>
          <div>Followers</div>
          {followers}
        </div>
        <div className={CSS.statistic}>
          <div>Posts</div>
          {postsCount}
        </div>
        <div className={CSS.statistic}>
          <div>Following</div>
          {followed}
        </div>
      </div>
      <div className={CSS.buttonArea}>
        <FollowButton isFollowing={following} userId={user.id} />
      </div>
    </div>
  );
}
