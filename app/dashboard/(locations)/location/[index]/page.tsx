import FetchLocation from "@/app/components/location/FetchLocation";

export default function Page({ params }: { params: { index: string } }) {
  const url = "location";
  const completeUrl = `https://pokeapi.co/api/v2/${url}/${params.index}`;

  return <FetchLocation url={completeUrl} />;
}
