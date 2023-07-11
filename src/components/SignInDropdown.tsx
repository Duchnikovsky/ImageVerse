"use client";
import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import DropDownCSS from "@/styles/dropdown.module.css";
import UserAvatar from "./UserAvatar";
import Link from "next/link";

export default function SignInDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={DropDownCSS.trigger}>
        <UserAvatar user={{}} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className={DropDownCSS.DropdownMenuContent}
        align="end"
      >
         <div className={DropDownCSS.DropdownUser}>
          <div className={DropDownCSS.DropdownUserData}>
            <span>Welcome to <b>ImageVerse</b></span>
          </div>
        </div>
        <DropdownMenu.Separator className={DropDownCSS.DropdownMenuSeparator} />
        <DropdownMenu.Item className={DropDownCSS.DropdownMenuItem} asChild>
          <Link href="/signIn">Sign in</Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
