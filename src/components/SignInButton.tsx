"use client";
import { FC, useState } from "react";
import CSS from "@/styles/auth.module.css";
import { Icons } from "@/components/Icons";
import { signIn } from "next-auth/react";
import { Button } from "./Button";

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
    <Button
      width={"95%"}
      height={"2.5rem"}
      isLoading={loading}
      isDisabled={false}
      fontSize={"20px"}
      margin={'auto'}
      onClick={() => login()}
    >
      <Icons.google className={CSS.google} />
    </Button>
  );
};

export default SignInButton;
