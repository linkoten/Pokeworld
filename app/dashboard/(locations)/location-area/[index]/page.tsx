import FetchLocationArea from "@/app/components/location/FetchLocationArea";

export default function Page({ params }: { params: { index: string } }) {
  const url = "location-area";
  const completeUrl = `https://pokeapi.co/api/v2/${url}/${params.index}`;

  return <FetchLocationArea url={completeUrl} />;
}
