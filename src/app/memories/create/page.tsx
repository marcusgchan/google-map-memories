import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { Header } from "~/components/header";
import { getServerAuthSession } from "~/server/auth";

export default async function Create() {
  noStore();

  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin?e=123");
  }

  return (
    <>
      <Header />
    </>
  );
}
