"use client";
import Image from "next/image";
import logo from "@/assets/logo.png";
import SignInButton from "@/components/SignInButton";
import CSS from "@/styles/auth.module.css";

export default function SignIn() {
  return (
    <div className={CSS.signIn}>
      <div className={CSS.main}>
        <div>
          <Image src={logo} alt="logo" className={CSS.logo} priority={true} />
        </div>
        <div>Sign in with Google to continue</div>
        <div className={CSS.privacy}>By signing in to the site you accept<br></br>the privacy policy and terms of use</div>
        <SignInButton />
      </div>
    </div>
  );
}
