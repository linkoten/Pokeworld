"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Search, RotateCcw } from "lucide-react";
import gsap from "gsap";

interface Pokemon {
  name: string;
  url: string;
  sprite: string;
  types: string[];
  generation: number;
}

interface PokemonEntry {
  entry_number: number;
  pokemon_species: {
    name: string;
  };
}

interface PokemonType {
  type: {
    name: string;
  };
}

const typeColors: { [key: string]: string } = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-700",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export default function DataList() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<number[]>([]);
  const [minIndex, setMinIndex] = useState(1);
  const [maxIndex, setMaxIndex] = useState(1025);
  const [sortBy, setSortBy] = useState("index");
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const cardsRef = useRef<HTMLDivElement>(null);
  const collapsibleContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllPokemon();
  }, []);

  useEffect(() => {
    filterAndSortPokemon();
  }, [
    allPokemon,
    selectedTypes,
    selectedGenerations,
    minIndex,
    maxIndex,
    sortBy,
  ]);

  useEffect(() => {
    updateDisplayedPokemon();
  }, [filteredPokemon, currentPage]);

  useEffect(() => {
    if (isFiltersOpen) {
      animateCollapsibleContent();
    }
  }, [isFiltersOpen]);

  async function fetchAllPokemon() {
    setIsLoading(true);
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokedex/1");
      const data = await response.json();
      const pokemonEntries = data.pokemon_entries;

      const pokemonData = await Promise.all(
        pokemonEntries.map(async (entry: PokemonEntry) => {
          const detailResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${entry.entry_number}`
          );
          const detail = await detailResponse.json();
          return {
            name: entry.pokemon_species.name,
            url: `https://pokeapi.co/api/v2/pokemon/${entry.entry_number}`,
            sprite: detail.sprites.front_default,
            types: detail.types.map((t: PokemonType) => t.type.name),
            generation: Math.floor((entry.entry_number - 1) / 151) + 1,
          };
        })
      );
      setAllPokemon(pokemonData);
      setFilteredPokemon(pokemonData);
    } catch (error) {
      console.error("Failed to fetch Pokemon data:", error);
    }
    setIsLoading(false);
  }

  function filterAndSortPokemon() {
    const filtered = allPokemon.filter((pokemon) => {
      const pokemonIndex = parseInt(pokemon.url.split("/").slice(-1)[0]);
      const matchesSearch =
        pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
        pokemonIndex.toString().includes(search);
      const matchesTypes =
        selectedTypes.length === 0 ||
        selectedTypes.some((type) => pokemon.types.includes(type));
      const matchesGenerations =
        selectedGenerations.length === 0 ||
        selectedGenerations.includes(pokemon.generation);
      const matchesIndexRange =
        pokemonIndex >= minIndex && pokemonIndex <= maxIndex;
      return (
        matchesSearch && matchesTypes && matchesGenerations && matchesIndexRange
      );
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "generation":
          return a.generation - b.generation;
        default:
          return (
            parseInt(a.url.split("/").slice(-1)[0]) -
            parseInt(b.url.split("/").slice(-1)[0])
          );
      }
    });

    setFilteredPokemon(filtered);
    setTotalPages(Math.ceil(filtered.length / 20));
    setCurrentPage(1);
  }

  function updateDisplayedPokemon() {
    const startIndex = (currentPage - 1) * 20;
    const endIndex = startIndex + 20;
    setDisplayedPokemon(filteredPokemon.slice(startIndex, endIndex));
    animateCards();
  }

  function handleSearch() {
    filterAndSortPokemon();
  }

  function resetFilters() {
    setSearch("");
    setSelectedTypes([]);
    setSelectedGenerations([]);
    setMinIndex(1);
    setMaxIndex(1025);
    setSortBy("index");
    setFilteredPokemon(allPokemon);
  }

  function animateCards() {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: "power2.out" }
      );
    }
  }

  function animateCollapsibleContent() {
    if (collapsibleContentRef.current) {
      gsap.fromTo(
        collapsibleContentRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" }
      );
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-8">
      <Collapsible
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        className="w-full space-y-2 mb-4"
      >
        <div className="flex items-center justify-between space-x-4 px-4 py-2 bg-red-600 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Filtres avancés</h2>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-9 p-0 hover:bg-red-700"
            >
              {isFiltersOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent
          className="space-y-4 bg-white p-4 rounded-b-lg shadow-md"
          ref={collapsibleContentRef}
        >
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min Index"
              value={minIndex}
              onChange={(e) => setMinIndex(parseInt(e.target.value))}
              min={1}
              max={1025}
              className="w-1/2 transition-all hover:shadow-md focus:shadow-md"
            />
            <Input
              type="number"
              placeholder="Max Index"
              value={maxIndex}
              onChange={(e) => setMaxIndex(parseInt(e.target.value))}
              min={1}
              max={1025}
              className="w-1/2 transition-all hover:shadow-md focus:shadow-md"
            />
          </div>
          <Select onValueChange={setSortBy}>
            <SelectTrigger className="transition-all hover:shadow-md focus:shadow-md">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="index">Index</SelectItem>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="generation">Génération</SelectItem>
            </SelectContent>
          </Select>
          <div>
            <h3 className="font-bold mb-2">Types</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(typeColors).map(([type, color]) => (
                <div key={type} className="flex items-center  w-fit">
                  <Checkbox
                    id={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      setSelectedTypes(
                        checked
                          ? [...selectedTypes, type]
                          : selectedTypes.filter((t) => t !== type)
                      );
                    }}
                  />
                  <label
                    htmlFor={type}
                    className={`ml-2 px-2 py-1 rounded ${color} text-white capitalize text-sm transition-all hover:shadow-md`}
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Générations</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((gen) => (
                <div
                  key={gen}
                  className="flex items-center transition-all hover:shadow-md"
                >
                  <Checkbox
                    id={`gen-${gen}`}
                    checked={selectedGenerations.includes(gen)}
                    onCheckedChange={(checked) => {
                      setSelectedGenerations(
                        checked
                          ? [...selectedGenerations, gen]
                          : selectedGenerations.filter((g) => g !== gen)
                      );
                    }}
                  />
                  <label htmlFor={`gen-${gen}`} className="ml-2 text-sm">
                    Gen {gen}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex space-x-2 mb-4">
        <Input
          placeholder="Rechercher par nom ou index"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow transition-all hover:shadow-md focus:shadow-md"
        />
        <Button
          onClick={handleSearch}
          className="transition-all hover:shadow-md"
        >
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
        <Button
          onClick={resetFilters}
          variant="outline"
          className="transition-all hover:shadow-md"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      <p className="my-4">
        Nombre de Pokémon correspondants : {filteredPokemon.length}
      </p>

      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        ref={cardsRef}
      >
        {displayedPokemon.map((pokemon: Pokemon) => (
          <Link href={pokemon.url} key={pokemon.name}>
            <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-4">
                <div className="relative w-full h-32">
                  <Image
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    #{pokemon.url.split("/").slice(-1)[0].padStart(3, "0")} •
                    Gen {pokemon.generation}
                  </p>
                  <h3 className="font-semibold capitalize">{pokemon.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pokemon.types.map((type) => (
                      <Badge key={type} className={`${typeColors[type]}`}>
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="transition-all hover:shadow-md"
        >
          Précédent
        </Button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="transition-all hover:shadow-md"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
