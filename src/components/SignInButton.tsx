"use client";
import { FC, useState } from "react";
import CSS from "@/styles/auth.module.css";
import { Icons } from "@/components/Icons";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface SignInButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const SignInButton: FC<SignInButtonProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);

  async function login() {
    setLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className={CSS.button} disabled={loading} onClick={login}>
      {loading ? (
        <Loader2 className={CSS.loader} />
      ) : (
        <Icons.google className={CSS.google} />
      )}
    </button>
  );
};

export default SignInButton;
