import { getVillageDetailsServer } from "@/lib/server-api/getVillageDetails";
import ClientComponent from "./ClientComponent";

interface Params {
  chokhlaId: string;
  chokhla: string;
}

export default async function ChokhlaDetailsPage({ params }: { params: Params }) {
  const villageDetails = await getVillageDetailsServer(params.chokhlaId);  // use chokhlaId here

  return <ClientComponent villageData={villageDetails} chokhlaName={params.chokhla} />;
}
