import { db } from "@/lib/db";
import { Session } from "next-auth";
import CSS from "@/styles/sidebar.module.scss";
import { Button } from "@/components/UI/Button";
import Link from "next/link";
import SuggestedUser from "@/components/SuggestedUser";

interface SidebarProps {
  session: Session | null;
}

export default async function Sidebar({ session }: SidebarProps) {
  let followedUsersIds: string[] = [];

  if (session && session?.user) {
    const followedUsers = await db.following.findMany({
      where: {
        followerId: session.user.id,
      },
    });

    followedUsersIds = followedUsers.map((follow) => follow.followedId);
  }

  const proposedUsers = await db.user.findMany({
    take: 5,
    where: {
      AND: [
        {
          id: {
            notIn: followedUsersIds,
          },
        },
        {
          id: {
            not: session?.user.id,
          },
        },
      ],
    },
    orderBy: {
      followedBy: {
        _count: "desc",
      },
    },
  });

  const proposedUsersCount = await db.user.count({
    where: {
      AND: [
        {
          id: {
            notIn: followedUsersIds,
          },
        },
        {
          id: {
            not: session?.user.id,
          },
        },
      ],
    },
  });

  if (session?.user)
    return (
      <div className={CSS.main}>
        <div className={CSS.sidebar}>
          <div className={CSS.description}>
            Share your experiences with friends and followers by adding new
            posts
          </div>
          <Link href="/create">
            <Button width="100%" height="2.25rem">
              Create post
            </Button>
          </Link>
        </div>
        {proposedUsersCount > 0 && (
          <div className={CSS.suggestedUsers}>
            <span className={CSS.header}>Suggestions for you</span>
            {proposedUsers.map((user, index) => (
              <SuggestedUser user={user} key={index} />
            ))}
          </div>
        )}
      </div>
    );

  return (
    <div className={CSS.main}>
      <div className={CSS.sidebar}>
        <div className={CSS.welcome}>Welcome to the ImageVerse</div>
        <div className={CSS.description}>
          Sign in and share your experiences with friends and followers by
          adding new posts
        </div>
        <Link href="/signIn">
          <Button width="100%" height="2.25rem" fontSize="17px">
            Sign in to ImageVerse
          </Button>
        </Link>
      </div>
    </div>
  );
}
