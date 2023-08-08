import { db } from "@/lib/db";
import { Session } from "next-auth";
import CSS from "@/styles/home.module.css";
import { Button } from "@/components/Button";
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
  })

  return (
    <div className={CSS.sidebar}>
      {session?.user ? (
        <div className={CSS.rightPanel}>
          <div className={CSS.userBox}>
            <div className={CSS.description}>
              Share your experiences with friends and followers by adding new
              posts
            </div>
            <Link href="/create">
              <Button
                width="80%"
                height="2rem"
                fontSize="17px"
                isDisabled={false}
                isLoading={false}
                margin={"auto"}
              >
                Create new post
              </Button>
            </Link>
          </div>
          {proposedUsersCount > 0 && <div className={CSS.proposedUsers}>
            <div className={CSS.proposedDescription}>Suggestions for you</div>
            {proposedUsers.map((user, index) => (
              <SuggestedUser user={user} key={index}/>
            ))}
          </div>}
        </div>
      ) : (
        <div className={CSS.rightPanel}>
          <div className={CSS.nameBox}>
            <p className={CSS.name}>Welcome to the ImageVerse</p>
          </div>
          <div className={CSS.description}>
            Sign in and share your experiences with friends and followers by
            adding new posts
          </div>
          <Link href="/signIn">
            <Button
              width="80%"
              height="2rem"
              fontSize="17px"
              isDisabled={false}
              isLoading={false}
              margin={"auto"}
            >
              Sign in to ImageVerse
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
