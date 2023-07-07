import { FC } from "react";
import CSS from "@/styles/auth.module.css";
import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Link from "next/link";
import SignInButton from "@/components/SignInButton";

 
const page: FC = () => {
  return (
    <div className={CSS.signIn}>
      <div className={CSS.main}>
        <Link href="/">
          <Image src={logo} alt="logo" className={CSS.logo} priority={true} />
        </Link>
        <div>Sign in with Google to continue</div>
        <SignInButton />
      </div>
    </div>
  )
}
 
export default page;