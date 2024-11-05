"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LocationAreaData } from "@/app/types/type";

export default function LocationAreaDisplay({
  areaData,
}: {
  areaData: LocationAreaData;
}) {
  const [pokemonDetails, setPokemonDetails] = useState<{ [key: string]: any }>(
    {}
  );
  const router = useRouter();

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const details: { [key: string]: any } = {};
      for (const encounter of areaData.pokemon_encounters) {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${encounter.pokemon.name}`
        );
        if (response.ok) {
          const data = await response.json();
          details[encounter.pokemon.name] = data;
        }
      }
      setPokemonDetails(details);
    };

    fetchPokemonDetails();
  }, [areaData]);

  const getAreaName = (name: string) => {
    const areaName = areaData.names.find((n) => n.language.name === "en");
    return areaName
      ? areaName.name
      : name
          .replace(/-/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
  };

  const navigateArea = (direction: "prev" | "next") => {
    const newId = direction === "next" ? areaData.id + 1 : areaData.id - 1;
    if (newId > 0) {
      router.push(`/dashboard/location-area/${newId}`);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => navigateArea("prev")}
          disabled={areaData.id === 1}
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous Area
        </Button>
        <h2 className="text-2xl font-bold text-center">
          {getAreaName(areaData.name)}
        </h2>
        <Button onClick={() => navigateArea("next")} variant="outline">
          Next Area <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {areaData.pokemon_encounters.map((encounter) => (
          <Card key={encounter.pokemon.name} className="overflow-hidden">
            <CardContent className="p-4">
              {pokemonDetails[encounter.pokemon.name] && (
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <Image
                    src={
                      pokemonDetails[encounter.pokemon.name].sprites
                        .front_default
                    }
                    alt={encounter.pokemon.name}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              )}
              <p className="text-center capitalize font-semibold">
                {encounter.pokemon.name}
              </p>
              <p className="text-center text-sm text-gray-500">
                Max Chance: {encounter.version_details[0]?.max_chance}%
              </p>
              <p className="text-center text-xs text-gray-400">
                Method:{" "}
                {encounter.version_details[0]?.encounter_details[0]?.method.name.replace(
                  "-",
                  " "
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
