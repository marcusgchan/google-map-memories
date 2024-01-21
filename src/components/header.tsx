"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Anchor } from "./ui/anchor";
import Link from "next/link";

export function Header() {
  const router = useRouter();
  return (
    <header className="my-4 mx-8 flex justify-between">
      <span className="cursor-pointer" onClick={() => router.back()}>&#8592; Back</span>
      <span className="flex items-center gap-4">
        <Anchor href="/api/auth/signout">Log out</Anchor>
        <Link href="/profile">Profile</Link>
      </span>
    </header>
  );
}
