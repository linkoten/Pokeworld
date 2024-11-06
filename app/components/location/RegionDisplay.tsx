"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import gsap from "gsap";

interface Location {
  name: string;
  url: string;
}

interface VersionGroup {
  name: string;
  url: string;
}

interface RegionData {
  id: number;
  name: string;
  names: Array<{ name: string; language: { name: string } }>;
  locations: Location[];
  version_groups: VersionGroup[];
  main_generation: {
    name: string;
    url: string;
  };
}

export default function RegionDisplay({
  regionData,
}: {
  regionData: RegionData;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      gsap.to(carousel, {
        x: `-${currentIndex * 100}%`,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [currentIndex]);

  const getRegionName = (name: string) => {
    const regionName = regionData.names.find((n) => n.language.name === "en");
    return regionName
      ? regionName.name
      : name
          .replace(/-/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
  };

  const navigateRegion = (direction: "prev" | "next") => {
    const newId = direction === "next" ? regionData.id + 1 : regionData.id - 1;
    if (newId > 0) {
      router.push(`/dashboard/region/${newId}`);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => navigateRegion("prev")}
          disabled={regionData.id === 1}
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous Region
        </Button>
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            {getRegionName(regionData.name)}
          </h2>
          <p className="text-xl text-gray-500">
            {regionData.main_generation?.name.replace(/-/g, " ").toUpperCase()}
          </p>
        </div>
        <Button onClick={() => navigateRegion("next")} variant="outline">
          Next Region <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">
            Locations in {getRegionName(regionData.name)}
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle locations</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          {regionData.locations.map((location) => (
            <Card key={location.name}>
              <CardHeader>
                <CardTitle className="text-sm capitalize">
                  {location.name.replace(/-/g, " ")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="link"
                  onClick={() => {
                    const locationId = location.url.split("/").slice(-2, -1)[0];
                    router.push(`/dashboard/location/${locationId}`);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
