import RegionDisplay from "./RegionDisplay";

export default async function FetchRegion({ url }: { url: string }) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return <RegionDisplay regionData={data} />;
}
