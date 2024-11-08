"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import gsap from "gsap";
import { GenerationData, PokemonData } from "@/app/types/type";
import { backgroundColors } from "@/app/lib/constant";

export default function Pokedex({
  generationData,
}: {
  generationData: GenerationData;
}) {
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const pokemonPromises = generationData.pokemon_species.map(
        async (species) => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${species.name}`
          );
          if (!response.ok) {
            console.error(`Failed to fetch details for ${species.name}`);
            return null;
          }
          return await response.json();
        }
      );

      const pokemonDetails = await Promise.all(pokemonPromises);
      setPokemonList(
        pokemonDetails.filter(
          (pokemon): pokemon is PokemonData => pokemon !== null
        )
      );
      setIsLoading(false);
    };

    fetchPokemonDetails();
  }, [generationData]);

  useEffect(() => {
    if (!isLoading) {
      gsap.from(".pokemon-card", {
        opacity: 0,
        y: 50,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <Card key={index} className="pokemon-card">
            <CardHeader className="p-4">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-24 w-24 mx-auto mb-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-16 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {pokemonList.map((pokemon) => (
        <Link href={`/dashboard/pokemon/${pokemon.id}`} key={pokemon.id}>
          <Card className="pokemon-card hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-bold">
                #{pokemon.id.toString().padStart(3, "0")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h3 className="text-center font-semibold capitalize mb-2">
                {pokemon.name}
              </h3>
              <div className="flex justify-center gap-2">
                {pokemon.types.map((type) => (
                  <Badge
                    key={type.type.name}
                    className={`${
                      backgroundColors[
                        type.type.name as keyof typeof backgroundColors
                      ]
                    } text-white capitalize`}
                  >
                    {type.type.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
