import LocationDisplay from "./LocationDisplay";

export default async function FetchLocation({ url }: { url: string }) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return <LocationDisplay locationData={data} />;
}
