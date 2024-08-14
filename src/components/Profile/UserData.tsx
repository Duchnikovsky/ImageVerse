"use client";

import { User } from "next-auth";
import UserAvatar from "../UserAvatar";
import CSS from "@/styles/ProfileStyles/profile.module.scss";
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
    <div className={CSS.profile}>
      <div className={CSS.avatar}>
        <UserAvatar user={user} style="large" />
      </div>
      <div className={CSS.header}>
        <div className={CSS.username}>{user.name}</div>
        <FollowButton isFollowing={following} userId={user.id} />
      </div>
      <div className={CSS.counters}>
        <div>
          Posts: <span>{postsCount}</span>
        </div>
        <div>
          Followers: <span>{followers}</span>
        </div>
        <div>
          Following: <span>{followed}</span>
        </div>
      </div>
      <div className={CSS.description}>
        <span>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero odit
          iste porro fugit. Saepe quae natus a totam recusandae suscipit impedit
          tempora, aperiam exercitationem! Eveniet suscipit maxime aut explicabo
          sint!Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Eum aut sequi voluptatum culpa ea dolore, dolorum numquam eveniet
          dicta nam possimus nihil minus officia. Fuga omnis fugit natus porro
          eos. impedit tempora, aperiam exercitationem! Eveniet suscipit maxime
          aut explicabo sint!Lorem Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Eum aut sequi voluptatum culpa ea dolore, dolorum
          numquam eveniet dicta nam possimus nihil minus officia. Fuga omnis
          fugit natus porro eos.
        </span>
      </div>
    </div>
  );
}
