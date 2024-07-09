"use client";

import CSS from "@/styles/NavbarStyles/navbar.module.scss";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Link from "next/link";
import UserDropdown from "@/components/Navbar/UserDropdown";
import SignInDropdown from "@/components/Navbar/SignInDropdown";
import NavOption from "./NavOption";
import { IoHomeSharp } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { MdAddAPhoto } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import NavbarSearchbar from "@/components/Navbar/NavbarSearchbar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => {
      return !prev;
    });
  }, []);

  return (
    <>
      <div className={`${CSS.header} ${isOpen ? CSS.open : CSS.closed}`}>
        <nav>
          <Link href="/" style={{ width: "100%" }}>
            <Image src={logo} alt="logo" className={CSS.logo} priority={true} />
          </Link>
          <div className={CSS.optionsContainer}>
            <Link
              href="/"
              onClick={() => {
                setIsOpen(true);
                setIsSearchOpen(false);
              }}
            >
              <NavOption option="Home page" icon={<IoHomeSharp />} />
            </Link>
            <NavOption
              onClick={() => {
                toggleNav();
                toggleSearch();
              }}
              option="Search"
              icon={<CiSearch strokeWidth={1.5} />}
            />
            <Link
              href="/create"
            >
              <NavOption option="Create post" icon={<MdAddAPhoto />} />
            </Link>
            <div className={CSS.lastOption}>
              {session?.user ? (
                <UserDropdown user={session.user}></UserDropdown>
              ) : (
                <SignInDropdown />
              )}
            </div>
          </div>
        </nav>
      </div>
      <div
        className={`${CSS.searchbar} ${
          isSearchOpen ? CSS.searchOpen : CSS.searchClosed
        }`}
      >
        <NavbarSearchbar toggleSearch={toggleSearch} />
      </div>
    </>
  );
}
