"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Generation, Pokemon } from "@/app/types/type";
import { fetchGenerations, fetchStarterData } from "@/app/lib/fetch/fetch";

gsap.registerPlugin(ScrollTrigger);

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

export default function GenerationsData() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [starterData, setStarterData] = useState<{ [key: string]: Pokemon[] }>(
    {}
  );
  const cardsRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Fetching and setting generations data
    async function loadGenerations() {
      const gens = await fetchGenerations();
      if (gens) setGenerations(gens);
    }
    loadGenerations();
  }, []);

  useEffect(() => {
    // Fetching and setting starter data once generations are loaded
    async function loadStarterData() {
      if (generations.length > 0) {
        const starters = await fetchStarterData(generations);
        if (starters) setStarterData(starters);
      }
    }
    loadStarterData();
  }, [generations]);

  useEffect(() => {
    Object.keys(starterData).forEach((genName) => {
      if (cardsRefs.current[genName]) {
        gsap.fromTo(
          cardsRefs.current[genName]!.children,
          { x: "100%", opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRefs.current[genName]!,
              start: "top bottom-=100",
              end: "bottom top+=100",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });
  }, [starterData]);

  return (
    <div className="p-8 space-y-12">
      <h1 className="text-3xl font-bold mb-8">
        Pokémon Generations - Starters
      </h1>
      {generations.map((generation, index) => (
        <div key={generation.name} className="space-y-4">
          <Link href={`/dashboard/generation/${index + 1}`}>
            <h2 className="text-2xl font-semibold hover:text-blue-600 transition-colors cursor-pointer">
              {generation.name
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h2>
          </Link>
          <div
            ref={(el) => {
              if (el) cardsRefs.current[generation.name] = el;
            }}
            className="flex justify-center space-x-4"
          >
            {starterData[generation.name]?.map((pokemon) => (
              <Link
                href={`/dashboard/pokemon/${pokemon.name}`}
                key={pokemon.name}
              >
                <Card className="w-40 hover:shadow-lg transition-shadow">
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
                        #{pokemon.index.toString().padStart(3, "0")}
                      </p>
                      <h3 className="font-semibold capitalize">
                        {pokemon.name}
                      </h3>
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
        </div>
      ))}
    </div>
  );
}
