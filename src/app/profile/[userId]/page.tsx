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

  return (
    <div>
      <ProfileFeed userId={userId} />
    </div>
  );
}
