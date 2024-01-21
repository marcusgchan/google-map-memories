import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "~/components/header";
import { Anchor } from "~/components/ui/anchor";
import { DeleteButton } from "~/components/delete-button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Profile() {
  noStore();

  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }

  const memories = await api.memory.getAll.query();

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-md rounded-md border-2 border-border p-4">
          <h1 className="text-xl">{session.user.email}</h1>
          <ul className="my-6">
            {!!memories.length ? (
              memories.map((memory) => (
                <li
                  key={memory.id}
                  className="flex items-center justify-between"
                >
                  <Link href={`/memories/${memory.id}`} className="w-full">
                    <h2 className="font-extrabold">{memory.title}</h2>
                    <p className="font-extralight">
                      {memory.date.toLocaleDateString()}
                    </p>
                  </Link>
                  <Anchor href={`/memories/${memory.id}/edit`}>Edit</Anchor>
                  <DeleteButton memoryId={memory.id} />
                </li>
              ))
            ) : (
              <p>No memories yet</p>
            )}
          </ul>
          <Anchor href="/memories/create">Submit A Memory</Anchor>
        </div>
      </main>
    </>
  );
}
