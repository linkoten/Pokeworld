"use client";

import { useState } from "react";
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
import { LocationData } from "@/app/types/type";

export default function LocationDisplay({
  locationData,
}: {
  locationData: LocationData;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const getLocationName = (name: string) => {
    const locationName = locationData.names.find(
      (n) => n.language.name === "en"
    );
    return locationName ? locationName.name : name;
  };

  const navigateLocation = (direction: "prev" | "next") => {
    const newId =
      direction === "next" ? locationData.id + 1 : locationData.id - 1;
    if (newId > 0) {
      router.push(`/dashboard/location/${newId}`);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => navigateLocation("prev")}
          disabled={locationData.id === 1}
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous Location
        </Button>
        <h2 className="text-2xl font-bold text-center">
          {getLocationName(locationData.name)}
        </h2>
        <Button onClick={() => navigateLocation("next")} variant="outline">
          Next Location <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Region:</strong> {locationData.region.name}
          </p>
          <p>
            <strong>Number of Areas:</strong> {locationData.areas.length}
          </p>
        </CardContent>
      </Card>

      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">Location Areas</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle location areas</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          {locationData.areas.map((area) => (
            <Card key={area.name}>
              <CardHeader>
                <CardTitle className="text-sm">
                  {area.name
                    .replace(/-/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="link"
                  onClick={() => {
                    const areaId = area.url.split("/").slice(-2, -1)[0];
                    router.push(`/dashboard/location-area/${areaId}`);
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
