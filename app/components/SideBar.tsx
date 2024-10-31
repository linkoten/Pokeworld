import Link from "next/link";
import { Home, Gamepad2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const apiCategories = [
  {
    title: "Pokemon",
    icon: Home,
    endpoint: "https://pokeapi.co/api/v2/pokemon",
    path: "/dashboard/pokemon",
  },
  {
    title: "Games",
    icon: Gamepad2,
    items: [
      {
        title: "Generations",
        endpoint: "https://pokeapi.co/api/v2/generation",
        path: "/dashboard/generations",
      },
      {
        title: "Pokedexes",
        endpoint: "https://pokeapi.co/api/v2/pokedex",
        path: "/dashboard/generations/pokedexes",
      },
      {
        title: "Versions",
        endpoint: "https://pokeapi.co/api/v2/version",
        path: "/dashboard/generations/versions",
      },
      {
        title: "Version Groups",
        endpoint: "https://pokeapi.co/api/v2/version-group",
        path: "/dashboard/generations/version-groups",
      },
    ],
  },
  {
    title: "Locations",
    icon: MapPin,
    items: [
      {
        title: "Locations",
        endpoint: "https://pokeapi.co/api/v2/location",
        path: "/dashboard/locations/locations",
      },
      {
        title: "Location Areas",
        endpoint: "https://pokeapi.co/api/v2/location-area",
        path: "/dashboard/locations/location-areas",
      },
      {
        title: "Pal Park Areas",
        endpoint: "https://pokeapi.co/api/v2/pal-park-area",
        path: "/dashboard/locations/pal-park-areas",
      },
      {
        title: "Regions",
        endpoint: "https://pokeapi.co/api/v2/region",
        path: "/dashboard/locations/regions",
      },
    ],
  },
];

export default function AppSidebar() {
  return (
    <Sidebar className=" border-r">
      <SidebarHeader className="p-4">
        <h2 className="text-2xl font-bold">PokeWorld</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {apiCategories.map((category, index) => (
            <SidebarMenu key={index}>
              <SidebarGroupLabel>{category.title}</SidebarGroupLabel>
              {category.items ? (
                category.items.map((item, subIndex) => (
                  <SidebarMenuItem key={subIndex}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={item.path}>
                        {subIndex === 0 && category.icon && (
                          <category.icon className="mr-2 h-4 w-4" />
                        )}
                        {item.title}
                      </Link>
                    </Button>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={category.path}>
                      {category.icon && (
                        <category.icon className="mr-2 h-4 w-4" />
                      )}
                      Explore {category.title}
                    </Link>
                  </Button>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
