import UserData from "@/components/Profile/UserData";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    userId: string;
  };
}) {
  const { userId } = params;

  const session = await getAuthSession();

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return notFound();
  }

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

  return (
    <section>
      <UserData
        user={user}
        postsCount={postsCount}
        followers={followers}
        followed={followed}
        following={isFollowing}
      />
      {children}
    </section>
  );
}
