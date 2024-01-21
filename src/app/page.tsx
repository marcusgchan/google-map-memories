import { Anchor } from "~/components/ui/anchor";

export default async function Home() {
  return (
    <>
      <header className="mb-4 flex justify-between">
        <span>Google Maps Memories</span>
        <Anchor href="/memories/create">Submit A Memory</Anchor>
      </header>
      <main className="">
        <h1 className="text-center text-4xl">
          Explore the captured memories of Google Maps
        </h1>
      </main>
    </>
  );
}
