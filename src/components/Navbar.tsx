import React from "react";
import CSS from "@/styles/navbar.module.css";
import Button from "@/components/Button";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import UserDropdown from "./UserDropdown";

export default async function Navbar() {
  const session = await getAuthSession();

  return (
    <div className={CSS.header}>
      <div className={CSS.main}>
        <Link href="/">
          <Image src={logo} alt="logo" className={CSS.logo} priority={true} />
        </Link>
        {session?.user ? <UserDropdown user={session.user}></UserDropdown> : <Link href="/signIn">
          <Button
            width={300}
            height={40}
            text="Sign In"
            isLoading={false}
            isDisabled={false}
          />
        </Link>}
      </div>
    </div>
  );
}
