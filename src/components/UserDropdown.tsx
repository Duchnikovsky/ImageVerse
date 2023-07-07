"use client";
import { User } from "next-auth";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import CSS from "@/styles/dropdown.module.css";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface UserDropdownProps {
  user: Pick<User, "name" | "image" | "email">;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={CSS.trigger}>
        <UserAvatar
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={CSS.DropdownMenuContent} align="end">
        <div className={CSS.DropdownUser}>
          <div className={CSS.DropdownUserData}>
            {user.name && <span style={{fontWeight: 'bold', fontSize: '18px'}}>{user.name}</span>}
            {user.email && <span style={{fontSize: '15px', lineHeight: '1.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{user.email}</span>}
          </div>
        </div>
        <DropdownMenu.Separator className={CSS.DropdownMenuSeparator} />
        <DropdownMenu.Item className={CSS.DropdownMenuItem} asChild>
          <Link href="/">Feed</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item className={CSS.DropdownMenuItem} asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Separator className={CSS.DropdownMenuSeparator} />
        <DropdownMenu.Item className={CSS.DropdownMenuItem} asChild onSelect={(e) => {
          e.preventDefault()
          signOut({
            callbackUrl: `${window.location.origin}/signIn`
          })
        }}>
          <span style={{cursor: 'pointer'}}>Sign out</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
