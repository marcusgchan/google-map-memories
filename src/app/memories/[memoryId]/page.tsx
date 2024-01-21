import { unstable_noStore } from "next/cache";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { env } from "~/env";
import { api } from "~/trpc/server";

export default async function Memory({
  params,
}: {
  params: { memoryId: string };
}) {
  unstable_noStore();
  const memory = await api.memory.getById.query({
    id: Number(params.memoryId),
  });

  if (!memory) {
    return <div>Memory not found</div>;
  }

  const streeViewURL = new URL(
    "https://maps.googleapis.com/maps/api/streetview",
  );
  streeViewURL.searchParams.append("key", env.NEXT_PUBLIC_GOOGLE_MAPS_KEY);
  streeViewURL.searchParams.append("size", `1920x1080`);
  streeViewURL.searchParams.append(
    "center",
    `-23.978774543562924,137.2404062463283`,
  );
  streeViewURL.searchParams.append("location", `${memory.lat},${memory.long}`);
  streeViewURL.searchParams.append("pitch", memory.pitch.toString());
  streeViewURL.searchParams.append("heading", memory.heading.toString());

  function formatDate(inputDate: string | Date) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const date = new Date(inputDate);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
  
    const formattedDate = `${month} ${day}, ${year}`;
    return formattedDate;
  }
  const center = { lat: 50.064192, lng: -130.605469 };

  
  return (
    <div className="relative mx-8 my-4 h-screen ">
      <img
        src={streeViewURL.toString()}
        className="fixed inset-0 -z-10 h-full w-full"
      />
      <div className="fixed inset-0 h-full w-full bg-[linear-gradient(180deg,rgba(0,0,0,1)0%,rgba(0,0,0,0)39%,rgba(0,0,0,0)72%,rgba(0,0,0,1)100%)]"></div>
      <div className="fixed text-lg">
        <a href="../">&#8592; Back</a>
      </div>
      <Card className="fixed bottom-16 left-16 h-64 w-5/12 overflow-auto border-none bg-black bg-opacity-85">
        <CardHeader className="m-1">
          <CardTitle className="text-2xl">{memory.title}</CardTitle>
          <CardDescription>{formatDate(memory.date)}</CardDescription>
        </CardHeader>
        <CardContent>{memory.description}</CardContent>
      </Card>
    </div>
  );
}
