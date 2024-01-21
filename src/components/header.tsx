"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Anchor } from "./ui/anchor";
import Link from "next/link";

export function Header() {
  const router = useRouter();
  return (
    <header className="flex justify-between">
      <Button onClick={() => router.back()}>Back</Button>
      <span className="flex items-center gap-4">
        <Link href="/profile">profile</Link>
        <Anchor href="/api/auth/signout">Logout</Anchor>
      </span>
    </header>
  );
}
