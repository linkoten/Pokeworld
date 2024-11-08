import { AreaData, Pokemon, PokemonData } from "@/app/types/type";

interface TypeInfo {
  type: {
    name: string;
  };
}

export async function fetchGenerations() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/generation");
    const data = await response.json();
    const generationsData = await Promise.all(
      data.results.map(async (gen: { url: string }, index: number) => {
        const genResponse = await fetch(gen.url);
        const genData = await genResponse.json();
        return {
          name: genData.name,
          url: gen.url,
          starters: getStartersForGeneration(index + 1),
        };
      })
    );
    return generationsData;
  } catch (error) {
    console.error("Failed to fetch generations:", error);
    return [];
  }
}

function getStartersForGeneration(genNumber: number): string[] {
  const starters = {
    1: ["bulbasaur", "charmander", "squirtle"],
    2: ["chikorita", "cyndaquil", "totodile"],
    3: ["treecko", "torchic", "mudkip"],
    4: ["turtwig", "chimchar", "piplup"],
    5: ["snivy", "tepig", "oshawott"],
    6: ["chespin", "fennekin", "froakie"],
    7: ["rowlet", "litten", "popplio"],
    8: ["grookey", "scorbunny", "sobble"],
    9: ["sprigatito", "fuecoco", "quaxly"],
  };
  return starters[genNumber as keyof typeof starters] || [];
}

export async function fetchStarterData(
  generations: { name: string; starters: string[] }[]
) {
  const newStarterData: { [key: string]: Pokemon[] } = {};

  for (const generation of generations) {
    const genStarters = await Promise.all(
      generation.starters.map(async (starterName: string) => {
        const pokemonResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${starterName}`
        );
        const pokemonData = await pokemonResponse.json();
        return {
          name: pokemonData.name,
          url: `https://pokeapi.co/api/v2/pokemon/${pokemonData.id}`,
          sprite: pokemonData.sprites.front_default,
          types: pokemonData.types.map((t: TypeInfo) => t.type.name),
          index: pokemonData.id,
        };
      })
    );
    newStarterData[generation.name] = genStarters;
  }

  return newStarterData;
}

export const fetchPokemonDetails = async (areaData: AreaData) => {
  const details: { [key: string]: PokemonData } = {};
  for (const encounter of areaData.pokemon_encounters) {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encounter.pokemon.name}`
    );
    if (response.ok) {
      const data = await response.json();
      details[encounter.pokemon.name] = data;
    }
  }
  return details;
};

export const fetchPokemonDetails2 = async (areaData: AreaData) => {
  const details: { [key: string]: PokemonData } = {};
  for (const encounter of areaData.pokemon_encounters) {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encounter.pokemon_species.name}`
    );
    if (response.ok) {
      const data = await response.json();
      details[encounter.pokemon_species.name] = data;
    }
  }
  return details;
};
