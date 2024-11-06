"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

export default function Page() {
  const pikachuCardRef = useRef<HTMLDivElement>(null);
  const eeveeCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pikachuCardRef.current && eeveeCardRef.current) {
      // Initial animation
      gsap.from(pikachuCardRef.current, {
        rotation: -15,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(eeveeCardRef.current, {
        rotation: 15,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      // Floating animation
      gsap.to([pikachuCardRef.current, eeveeCardRef.current], {
        y: -10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  const handleHover = (card: HTMLDivElement, direction: "in" | "out") => {
    gsap.to(card, {
      scale: direction === "in" ? 1.2 : 1,
      brightness: direction === "in" ? 1.2 : 1,
      rotate:
        direction === "in" ? (card === pikachuCardRef.current ? 20 : -20) : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Pokémon Cards Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-100 to-purple-100 p-8 flex items-center justify-center relative overflow-hidden">
        <div className="relative w-full h-[500px]">
          <div
            ref={pikachuCardRef}
            className="absolute left-0 bottom-0 w-64 h-96 transform -rotate-12 transition-all duration-300 ease-in-out"
            onMouseEnter={() => handleHover(pikachuCardRef.current!, "in")}
            onMouseLeave={() => handleHover(pikachuCardRef.current!, "out")}
          >
            <Card className="w-full h-full overflow-hidden bg-yellow-400 shadow-lg hover:shadow-xl transition-shadow duration-300 relative border-yellow-600 border-2">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-50"></div>
              <CardContent className="p-4 relative z-10">
                <Image
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                  alt="Pikachu"
                  width={200}
                  height={200}
                  className="mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold text-center mb-2">Pikachu</h3>
                <p className="text-sm text-center mb-2">
                  The Electric Mouse Pokémon
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Can generate powerful electricity</li>
                  <li>• Cheeks store electricity</li>
                  <li>• Mascot of the Pokémon franchise</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div
            ref={eeveeCardRef}
            className="absolute right-0 bottom-0 w-64 h-96 transform rotate-12 transition-all duration-300 ease-in-out"
            onMouseEnter={() => handleHover(eeveeCardRef.current!, "in")}
            onMouseLeave={() => handleHover(eeveeCardRef.current!, "out")}
          >
            <Card className="w-full h-full overflow-hidden bg-zinc-300 shadow-lg hover:shadow-xl transition-shadow duration-300 relative border-zinc-500 border-2">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-400 opacity-50"></div>
              <CardContent className="p-4 relative z-10">
                <Image
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png"
                  alt="Eevee"
                  width={200}
                  height={200}
                  className="mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold text-center mb-2">Eevee</h3>
                <p className="text-sm text-center mb-2">
                  The Evolution Pokémon
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Can evolve into various forms</li>
                  <li>• Adaptable genetic makeup</li>
                  <li>• Popular for its cute appearance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* PokeWorld Presentation Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-red-500 to-orange-500 p-8 flex items-center justify-center">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold mb-6">Welcome to PokeWorld</h1>
          <p className="text-xl mb-4">
            Dive into the fascinating world of Pokémon with comprehensive data
            at your fingertips.
          </p>
          <p className="text-xl mb-8">
            Explore, learn, and become the ultimate Pokémon master with our
            extensive PokéAPI-powered database.
          </p>
          <Button
            asChild
            size="lg"
            className="w-full bg-white text-red-500 hover:bg-red-100 hover:text-red-600"
          >
            <Link href="/dashboard">Enter PokeWorld</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
