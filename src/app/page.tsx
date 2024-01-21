import Link from "next/link";
import { Anchor } from "~/components/ui/anchor";
import { InteractiveGlobe } from "~/components/interactive-globe";

export default async function Home() {
  return (
    <>
      <header className="mb-4 flex justify-between">
        <span>Google Maps Memories</span>
        <span className="flex items-center gap-4">
          <Anchor href="/memories/create">Submit A Memory</Anchor>
          <Link href="/profile">Profile</Link>
        </span>
      </header>
      <main className="">
        <h1 className="font-['Instrument Serif'] text-center text-4xl">
          Explore the captured memories of Google Maps
        </h1>
        <article>
          <InteractiveGlobe />
        </article>
      </main>
    </>
  );
}
