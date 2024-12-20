"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AreaData, PokemonData } from "@/app/types/type";
import { areaColors } from "@/app/lib/constant";
import { fetchPokemonDetails2 } from "@/app/lib/fetch/fetch";

export default function PalParkAreaDisplay({
  areaData,
}: {
  areaData: AreaData;
}) {
  const [pokemonDetails, setPokemonDetails] = useState<{
    [key: string]: PokemonData;
  }>({});
  const router = useRouter();

  useEffect(() => {
    async function loadPokemonDetails() {
      const details = await fetchPokemonDetails2(areaData);
      if (details) setPokemonDetails(details);
    }
    loadPokemonDetails();
  }, []);

  const getAreaName = (name: string) => {
    const areaName = areaData.names.find((n) => n.language.name === "en");
    return areaName ? areaName.name : name;
  };

  const navigateArea = (direction: "prev" | "next") => {
    const newId = direction === "next" ? areaData.id + 1 : areaData.id - 1;
    if (newId > 0 && newId < 6) {
      router.push(`/dashboard/pal-park-area/${newId}`);
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
        <Button
          onClick={() => navigateArea("next")}
          variant="outline"
          disabled={areaData.id === 5}
        >
          Next Area <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 rounded-lg `}
      >
        {areaData.pokemon_encounters.map((encounter) => (
          <Card
            key={encounter.pokemon_species.name}
            className={`${areaColors[areaData.name]} overflow-hidden`}
          >
            <CardContent className="p-4">
              {pokemonDetails[encounter.pokemon_species.name] && (
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <Image
                    src={
                      pokemonDetails[encounter.pokemon_species.name].sprites
                        ?.front_default || "placeholder.png"
                    }
                    alt={encounter.pokemon_species.name}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              )}
              <p className="text-center capitalize font-semibold">
                {encounter.pokemon_species.name}
              </p>
              <p className="text-center text-sm text-gray-500">
                Score: {encounter.base_score}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
