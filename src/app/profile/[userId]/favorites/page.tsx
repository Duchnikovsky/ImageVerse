import FavoriteFeed from "@/components/Feed/FavoriteFeed";
import React from "react";

interface pageProps {
  params: {
    userId: string;
  };
}

export default function page({ params }: pageProps) {
  const { userId } = params;

  return <FavoriteFeed userId={userId} />;
}
