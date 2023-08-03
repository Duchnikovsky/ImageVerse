import ProfileFeed from "@/components/Profile/ProfileFeed";
import UserData from "@/components/Profile/UserData";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import CSS from "@/styles/profile.module.css";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    userId: string;
  };
}

export default async function page({ params }: pageProps) {
  const { userId } = params;

  const session = await getAuthSession();

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  const following = !session?.user
    ? undefined
    : await db.following.findFirst({
        where: {
          followedId: userId,
          followerId: session?.user.id,
        },
      });

  const isFollowing = !!following;

  const postsCount = await db.post.count({
    where: {
      authorId: userId,
    },
  });

  const followers = await db.following.count({
    where: {
      followedId: userId,
    },
  });

  const followed = await db.following.count({
    where: {
      followerId: userId,
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <div className={CSS.main}>
      <UserData
        user={user}
        postsCount={postsCount}
        followers={followers}
        followed={followed}
        following={isFollowing}
      />
      <ProfileFeed userId={userId} />
    </div>
  );
}
