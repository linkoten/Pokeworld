"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PokemonCard from "./PokemonCard";
import gsap from "gsap";
import { PokemonData } from "@/app/types/type";

export default function PokemonCarousel({
  initialPokemon,
}: {
  initialPokemon: PokemonData;
}) {
  const [pokemon, setPokemon] = useState(initialPokemon);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navigatePokemon = async (direction: "prev" | "next") => {
    if (isAnimating) return;

    const newId = direction === "next" ? pokemon.id + 1 : pokemon.id - 1;
    if (newId < 1) return; // Prevent navigating to invalid IDs

    setIsAnimating(true);

    // Animate out
    await gsap.to(cardRef.current, {
      x: direction === "next" ? -1000 : 1000,
      opacity: 0,
      duration: 0.3,
    });

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${newId}`
      );
      if (!response.ok) throw new Error("Pokemon not found");
      const newPokemon = await response.json();
      setPokemon(newPokemon);
      router.push(`/dashboard/pokemon/${newId}`, { scroll: false });

      // Reset position
      gsap.set(cardRef.current, { x: direction === "next" ? 1000 : -1000 });

      // Animate in
      await gsap.to(cardRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.3,
      });
    } catch (error) {
      console.error("Failed to fetch pokemon:", error);
    }

    setIsAnimating(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div ref={cardRef}>
        <PokemonCard pokemon={pokemon} />
      </div>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigatePokemon("prev")}
          disabled={pokemon.id === 1 || isAnimating}
          className="rounded-full"
          aria-label="Previous Pokémon"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigatePokemon("next")}
          disabled={isAnimating}
          className="rounded-full"
          aria-label="Next Pokémon"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
