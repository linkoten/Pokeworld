import FetchRegion from "@/app/components/location/FetchRegion";

export default function Page({ params }: { params: { index: string } }) {
  const url = "region";
  const completeUrl = `https://pokeapi.co/api/v2/${url}/${params.index}`;

  return <FetchRegion url={completeUrl} />;
}
