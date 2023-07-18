import Button from "@/components/Button";
import PostFeed from "@/components/Feed/PostFeed";
import { getAuthSession } from "@/lib/auth";
import CSS from "@/styles/home.module.css";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      <div className={CSS.grid}>
        <PostFeed />
        {session?.user ? (
          <div className={CSS.userBox}>
            <div className={CSS.nameBox}>
              <p className={CSS.name}>{session?.user.name}</p>
            </div>
            <div className={CSS.description}>
              Share your experiences with friends and followers by adding new
              posts
            </div>
            <div className={CSS.buttonBox}>
              <Link href="/create">
                <Button
                  width={240}
                  height={34}
                  isDisabled={false}
                  isLoading={false}
                  text="Create new post"
                />
              </Link>
            </div>
          </div>
        ) : (
          <div className={CSS.userBox}>
            <div className={CSS.nameBox}>
              <p className={CSS.name}>Sign in to follow users</p>
            </div>
            <div className={CSS.description}>
              Sign in and share your experiences with friends and followers by adding new
              posts
            </div>
          </div>
        )}
      </div>
    </>
  );
}
