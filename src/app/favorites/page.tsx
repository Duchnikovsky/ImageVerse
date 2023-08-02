import FavoriteFeed from "@/components/Feed/FavoriteFeed";
import { getAuthSession } from "@/lib/auth";
import CSS from "@/styles/favorites.module.css";
import { AlertCircle } from "lucide-react";

export default async function page() {
  const session = await getAuthSession();

  if (!session) {
    return (
      <div className={CSS.main}>
        <div className={CSS.unauthorized}>
          <AlertCircle size={90} />
          You must sign in to access this page
        </div>
      </div>
    );
  }

  return <div className={CSS.main}>
    <FavoriteFeed />
  </div>;
}
