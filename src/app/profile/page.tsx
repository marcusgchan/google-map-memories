import { unstable_noStore as noStore } from "next/cache";
import { redirect, useRouter } from "next/navigation";
import { Header } from "~/components/header";
import { Anchor } from "~/components/ui/anchor";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Profile() {
  noStore();

  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <>
      <Header />
      <main></main>
    </>
  );
}
