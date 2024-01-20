import { unstable_noStore as noStore } from "next/cache";

export default async function Profile() {
  noStore();
  return <div>Profile</div>;
}
