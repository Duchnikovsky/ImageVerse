import PostFeed from "@/components/Feed/PostFeed";
import Sidebar from "@/components/Sidebar";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import CSS from "@/styles/home.module.css";

export default async function Home() {
  const session = await getAuthSession();

  const following =
    (await db.following.count({
      where: {
        followerId: session?.user.id,
      },
    })) || 0;

  return (
    <>
      <div className={CSS.grid}>
        <PostFeed session={session!} following={following} />
        <Sidebar session={session!}/>
      </div>
    </>
  );
}
