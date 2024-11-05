import FetchPokemon from "@/app/components/pokemon/FetchData";

export default function Page({ params }: { params: { index: string } }) {
  const url = "location";
  const completeUrl = `https://pokeapi.co/api/v2/${url}/${params.index}`;

  return <FetchPokemon url={completeUrl} />;
}
