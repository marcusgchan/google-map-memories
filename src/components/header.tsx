"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Anchor } from "./ui/anchor";

export function Header() {
  const router = useRouter();
  return (
    <header className="flex justify-between">
      <Button onClick={() => router.back()}>Back</Button>
      <Anchor href="/api/auth/signout">Logout</Anchor>
    </header>
  );
}
