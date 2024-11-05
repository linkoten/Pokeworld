import PalParkAreaDisplay from "./PalParkAreaDisplay";

export default async function FetchPalParkArea({ url }: { url: string }) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return <PalParkAreaDisplay areaData={data} />;
}
