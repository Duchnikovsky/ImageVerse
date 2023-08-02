import { Button } from "@/components/Button";
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
            <div className={CSS.description}>
              Share your experiences with friends and followers by adding new
              posts
            </div>
            <div className={CSS.buttonBox}>
              <Link href="/create">
                <Button
                  width="80%"
                  height="2rem"
                  fontSize="17px"
                  isDisabled={false}
                  isLoading={false}
                  margin={'auto'}
                >
                  Create new post
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className={CSS.userBox}>
            <div className={CSS.nameBox}>
              <p className={CSS.name}>Welcome to the ImageVerse</p>
            </div>
            <div className={CSS.description}>
              Sign in and share your experiences with friends and followers by
              adding new posts
            </div>
            <Link href='/signIn'>
            <Button
              width="80%"
              height="2rem"
              fontSize="17px"
              isDisabled={false}
              isLoading={false}
              margin={'auto'}
            >
              Sign in to ImageVerse
            </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
