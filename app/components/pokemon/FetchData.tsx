import PokemonCarousel from "./PokemonCarousel";

export default async function FetchPokemon({ url }: { url: string }) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return <PokemonCarousel initialPokemon={data} />;
}
