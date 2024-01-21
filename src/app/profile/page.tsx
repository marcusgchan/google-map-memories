import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Profile() {
  noStore();

  const memories = await api.memory.getAll.query();

  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-md rounded-md border-2 border-border p-4">
          <h1 className="mb-6 text-xl">{session.user.email}</h1>
          <ul>
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
                  <Button>Edit</Button>
                </li>
              ))
            ) : (
              <p>No memories yet</p>
            )}
          </ul>
        </div>
      </main>
    </>
  );
}
