import Pokedex from "./Pokedex";

export default async function FetchGeneration({ url }: { url: string }) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return <Pokedex generationData={data} />;
}
