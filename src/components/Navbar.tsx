import React from "react";
import CSS from "@/styles/navbar.module.css";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import UserDropdown from "@/components/UserDropdown";
import SignInDropdown from "@/components/SignInDropdown";
import Searchbar from "./Searchbar";

export default async function Navbar() {
  const session = await getAuthSession();

  return (
    <div className={CSS.header}>
      <div className={CSS.main}>
        <Link href="/">
          <Image src={logo} alt="logo" className={CSS.logo} priority={true} />
        </Link>
        <Searchbar />
        {session?.user ? (
          <UserDropdown user={session.user}></UserDropdown>
        ) : (
          <SignInDropdown />
        )}
      </div>
    </div>
  );
}
