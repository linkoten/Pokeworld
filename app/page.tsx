import PokemonList from "./components/Data-List";

export default function Page() {
  return (
    <div className="p-24">
      <PokemonList url="pokemon" />
    </div>
  );
}
