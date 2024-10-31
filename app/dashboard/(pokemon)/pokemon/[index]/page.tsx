import FetchPokemon from "@/app/components/pokemon/FetchPokemon";

export default function Page({ params }: { params: { index: string } }) {
  const url = "pokemon";
  const completeUrl = `https://pokeapi.co/api/v2/${url}/${params.index}`;

  return <FetchPokemon url={completeUrl} />;
}
