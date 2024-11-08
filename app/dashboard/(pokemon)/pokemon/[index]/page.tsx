import PokemonCarousel from "@/app/components/pokemon/PokemonCarousel";

export default async function Page({ params }: { params: { index: string } }) {
  const url = "pokemon";
  const completeUrl = `https://pokeapi.co/api/v2/${url}/${params.index}`;

  const response = await fetch(completeUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return <PokemonCarousel initialPokemon={data} />;
}
