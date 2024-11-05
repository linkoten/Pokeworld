"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PokemonData {
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
    };
  }>;
  species: {
    url: string;
  };
}

interface EvolutionData {
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

const backgroundColors = {
  normal: "bg-zinc-500",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-500",
  grass: "bg-green-500",
  ice: "bg-cyan-500",
  fighting: "bg-red-500",
  poison: "bg-purple-500",
  ground: "bg-amber-500",
  flying: "bg-indigo-500",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-stone-500",
  ghost: "bg-violet-500",
  dragon: "bg-teal-500",
  dark: "bg-gray-500",
  steel: "bg-slate-500",
  fairy: "bg-rose-500",
};

const borderColors = {
  normal: "border-zinc-200",
  fire: "border-orange-200",
  water: "border-blue-200",
  electric: "border-yellow-200",
  grass: "border-green-200",
  ice: "border-cyan-200",
  fighting: "border-red-200",
  poison: "border-purple-200",
  ground: "border-amber-200",
  flying: "border-indigo-200",
  psychic: "border-pink-200",
  bug: "border-lime-200",
  rock: "border-stone-200",
  ghost: "border-violet-200",
  dragon: "border-teal-200",
  dark: "border-gray-200",
  steel: "border-slate-200",
  fairy: "border-rose-200",
};

export default function PokemonCard({ pokemon }: { pokemon: PokemonData }) {
  const [mainImage, setMainImage] = useState(
    pokemon.sprites.other["official-artwork"].front_default
  );
  const [isMovesOpen, setIsMovesOpen] = useState(false);
  const [evolution, setEvolution] = useState<EvolutionData | null>(null);
  const [moves, setMoves] = useState<any[]>([]);

  const imageRef = useRef<HTMLImageElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const generationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEvolutionChain();
    fetchMoves();

    // Animate main image
    gsap.fromTo(
      imageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );

    // Animate stats
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.querySelectorAll(".progress-bar"),
        { width: 0 },
        { width: "100%", duration: 0.5, stagger: 0.1 }
      );
    }

    // Animate info sections
    if (infoRef.current) {
      gsap.fromTo(
        infoRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }
      );
    }

    // Animate generations
    if (generationsRef.current) {
      gsap.fromTo(
        generationsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
      );
    }
  }, [pokemon]);

  const fetchEvolutionChain = async () => {
    try {
      const speciesResponse = await fetch(pokemon.species.url);
      const speciesData = await speciesResponse.json();
      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();
      setEvolution(evolutionData);
    } catch (error) {
      console.error("Failed to fetch evolution data:", error);
    }
  };

  const fetchMoves = async () => {
    try {
      const movePromises = pokemon.moves.map(({ move }) =>
        fetch(move.url).then((res) => res.json())
      );
      const moveData = await Promise.all(movePromises);
      setMoves(moveData);
    } catch (error) {
      console.error("Failed to fetch move data:", error);
    }
  };

  const renderEvolutions = () => {
    if (!evolution) return null;

    const chain = [
      evolution.chain.species,
      ...evolution.chain.evolves_to.map((e) => e.species),
      ...evolution.chain.evolves_to.flatMap((e) =>
        e.evolves_to.map((e2) => e2.species)
      ),
    ];

    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {chain.map((species, index) => (
          <Link
            key={species.name}
            href={`/dashboard/pokemon/${
              species.url.split("/").slice(-2, -1)[0]
            }`}
            scroll={false}
          >
            <div className="flex flex-col items-center">
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species.url
                  .split("/")
                  .slice(-2, -1)}.png`}
                alt={species.name}
                width={60}
                height={60}
              />
              <span className="text-sm capitalize">{species.name}</span>
              {index < chain.length - 1 && <ChevronDown className="w-4 h-4" />}
            </div>
          </Link>
        ))}
      </div>
    );
  };

  const renderGameSprites = () => {
    const gameSprites = Object.entries(pokemon.sprites.versions)
      .flatMap(([generation, games]) =>
        Object.entries(games).map(([game, sprites]) => ({
          generation,
          game,
          sprite: sprites.front_default,
        }))
      )
      .filter(({ sprite }) => sprite !== null);

    return (
      <Tabs
        defaultValue={gameSprites[0]?.generation}
        className={`${cardStyle.border} w-full mt-4 py-2 border-2 rounded-sm`}
      >
        <TabsList
          className="justify-start flex-wrap h-auto bg-white"
          ref={generationsRef}
        >
          {Array.from(new Set(gameSprites.map((s) => s.generation))).map(
            (gen) => (
              <TabsTrigger key={gen} value={gen}>
                {gen}
              </TabsTrigger>
            )
          )}
        </TabsList>
        {Array.from(new Set(gameSprites.map((s) => s.generation))).map(
          (gen) => (
            <TabsContent key={gen} value={gen} className="mt-2">
              <div className="flex flex-wrap gap-2">
                {gameSprites
                  .filter((s) => s.generation === gen)
                  .map(({ game, sprite }) => (
                    <Button
                      key={game}
                      variant="outline"
                      size="sm"
                      className="p-1"
                      onClick={() => setMainImage(sprite)}
                    >
                      <Image src={sprite} alt={game} width={40} height={40} />
                    </Button>
                  ))}
              </div>
            </TabsContent>
          )
        )}
      </Tabs>
    );
  };

  const mainType = pokemon.types[0].type.name;

  let cardStyle = {
    border: borderColors[`${mainType}` as keyof typeof borderColors],
    background:
      backgroundColors[`${mainType}` as keyof typeof backgroundColors],
  };

  return (
    <Card
      className={`${cardStyle.border} w-full max-w-2xl mx-auto border-2 shadow-lg`}
    >
      <CardHeader className="text-center">
        <CardTitle className="capitalize text-2xl">
          {pokemon.name} #{pokemon.id.toString().padStart(3, "0")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative w-full aspect-square">
              <Image
                ref={imageRef}
                src={mainImage}
                alt={pokemon.name}
                fill
                className="object-contain"
                priority
              />
            </div>
            {renderGameSprites()}
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex gap-2 justify-center">
              {pokemon.types.map(({ type }) => (
                <Badge
                  key={type.name}
                  className={`${
                    backgroundColors[type.name as keyof typeof backgroundColors]
                  } text-white capitalize`}
                >
                  {type.name}
                </Badge>
              ))}
            </div>
            <div className="space-y-2" ref={statsRef}>
              <h3 className="font-semibold">Stats</h3>
              {pokemon.stats.map(({ base_stat, stat }) => (
                <div key={stat.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">
                      {stat.name.replace("-", " ")}
                    </span>
                    <span>{base_stat}</span>
                  </div>
                  <div className="progress-bar">
                    <Progress
                      value={base_stat}
                      max={255}
                      className={`${cardStyle.border} h-2 border-2`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div ref={infoRef}>
              <div>
                <h3 className="font-semibold mb-2">Height</h3>
                <p>{(pokemon.height / 10).toFixed(1)}m</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Weight</h3>
                <p>{(pokemon.weight / 10).toFixed(1)}kg</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Abilities</h3>
                <div className="flex gap-2 flex-wrap">
                  {pokemon.abilities.map(({ ability }) => (
                    <Badge
                      key={ability.name}
                      variant="outline"
                      className="capitalize"
                    >
                      {ability.name.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {renderEvolutions()}

        <Collapsible open={isMovesOpen} onOpenChange={setIsMovesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              {isMovesOpen ? "Hide Moves" : "Show Moves"}
              {isMovesOpen ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Move</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moves.map((move) => (
                  <TooltipProvider key={move.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableRow
                          className={`${
                            backgroundColors[
                              move.type.name as keyof typeof backgroundColors
                            ]
                          }22`}
                        >
                          <TableCell className="capitalize">
                            {move.name.replace("-", " ")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                backgroundColors[
                                  move.type
                                    .name as keyof typeof backgroundColors
                                ]
                              } text-white capitalize`}
                            >
                              {move.type.name}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          <strong>Power:</strong> {move.power || "N/A"}
                        </p>
                        <p>
                          <strong>Accuracy:</strong> {move.accuracy || "N/A"}
                        </p>
                        <p>
                          <strong>PP:</strong> {move.pp}
                        </p>
                        <p>
                          <strong>Effect:</strong>{" "}
                          {move.effect_entries[0]?.short_effect ||
                            "No description available"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </TableBody>
            </Table>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
