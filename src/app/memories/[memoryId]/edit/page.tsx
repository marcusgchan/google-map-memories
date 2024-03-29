import { Header } from "~/components/header";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { EditForm } from "./EditForm";
import { api } from "~/trpc/server";

export default async function Edit({
  params,
}: {
  params: { memoryId: string };
}) {
  noStore();

  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }

  const memory = await api.memory.getById.query({
    id: Number(params.memoryId),
  });

  return (
    <>
      <Header />
      <main>
        {memory && <EditForm memory={memory} />}
        {!memory && <p>Memory not found</p>}
      </main>
    </>
  );
}
