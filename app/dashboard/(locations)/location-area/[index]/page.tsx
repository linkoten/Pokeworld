import LocationAreaDisplay from "@/app/components/location/LocationAreaDisplay";

export default async function Page({ params }: { params: { index: string } }) {
  const url = "location-area";
  const completeUrl = `https://pokeapi.co/api/v2/${url}/${params.index}`;

  const response = await fetch(completeUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return <LocationAreaDisplay areaData={data} />;
}
