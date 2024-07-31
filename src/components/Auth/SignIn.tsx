"use client";
import Image from "next/image";
import logo from "@/assets/logo.png";
import SignInButton from "@/components/Auth/SignInButton";
import CSS from "@/styles/auth.module.scss";

export default function SignIn() {
  return (
    <div className={CSS.signIn}>
      <div>
        <Image src={logo} alt="logo" className={CSS.logo} priority={true} />
      </div>
      <span>Sign in with Google to continue</span>
      <span className={CSS.privacy}>
        By signing in to the site you accept<br></br>the privacy policy and
        terms of use
      </span>
      <SignInButton />
    </div>
  );
}
