export interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
    versions: {
      [key: string]: {
        [key: string]: {
          front_default: string;
        };
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  moves: Array<{
    move: {
      url: string;
      name: string;
    };
  }>;
  species: {
    url: string;
  };
}

export interface EvolutionData {
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: Array<{
      species: {
        name: string;
        url: string;
      };
      evolves_to: Array<{
        species: {
          name: string;
          url: string;
        };
      }>;
    }>;
  };
}

export interface PokemonDetails {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: { front_default: string };
}

export interface GenerationData {
  pokemon_species: Array<{ name: string }>;
}

export interface MoveData {
  name: string; // Nom du mouvement
  type: {
    name: string;
    url: string; // URL vers les informations détaillées du type
  };
  power: number | null; // Puissance du mouvement
  accuracy: number | null; // Précision du mouvement
  pp: number; // Nombre d'utilisations du mouvement
  effect_entries: Array<{
    effect: string; // Effet du mouvement (version courte)
    short_effect: string; // Effet du mouvement (version abrégée)
  }>;
  damage_class: {
    name: string; // Classe de dégâts (physique, spécial)
  };
  meta: {
    ailment: {
      name: string; // Malus infligé (paralysie, brûlure, etc.)
    };
    min_hits: number | null; // Nombre minimum de coups
    max_hits: number | null; // Nombre maximum de coups
    min_turns: number | null; // Nombre minimum de tours
    max_turns: number | null; // Nombre maximum de tours
  };
}

export interface PokemonEncounter {
  base_score: number;
  pokemon_species: {
    name: string;
    url: string;
  };
}

export interface PalParkAreaData {
  id: number;
  name: string;
  names: Array<{ name: string; language: { name: string } }>;
  pokemon_encounters: PokemonEncounter[];
}

export interface PokemonEncounter {
  pokemon: {
    name: string;
    url: string;
  };
  version_details: Array<{
    max_chance: number;
    encounter_details: Array<{
      method: {
        name: string;
      };
    }>;
  }>;
}

export interface LocationAreaData {
  id: number;
  name: string;
  names: Array<{ name: string; language: { name: string } }>;
  pokemon_encounters: PokemonEncounter[];
}
