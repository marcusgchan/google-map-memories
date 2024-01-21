import Link from "next/link";
import { Anchor } from "~/components/ui/anchor";
import { InteractiveGlobe } from "~/components/interactive-globe";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <>
      <header className="mx-8 my-4 flex justify-between">
        <span>Google Maps Memories</span>
        <span className="flex items-center gap-4">
          <Anchor href="/memories/create">Submit A Memory</Anchor>
          {session ? (
            <Link href="/profile">Profile</Link>
          ) : (
            <Link href="/api/auth/signin">Login</Link>
          )}
        </span>
      </header>
      <main className="">
        <h1 className="text-center font-['Instrument_Serif'] text-[64px] leading-none">
          Explore the captured
          <br />
          memories of Google Maps
        </h1>
        <article>
          <InteractiveGlobe />
        </article>
      </main>
    </>
  );
}
