"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Pokemon {
  name: string;
  url: string;
}

export default function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchPokemons(currentPage);
  }, [currentPage]);

  async function fetchPokemons(page: number) {
    const offset = (page - 1) * 20;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`
    );
    const data = await response.json();
    setPokemons(data.results);
    setTotalPages(Math.ceil(data.count / 20));
  }

  return (
    <div className="p-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Index</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pokemons.map((pokemon: Pokemon, index: number) => (
            <TableRow key={pokemon.name}>
              <TableCell>{(currentPage - 1) * 20 + index + 1}</TableCell>
              <TableCell className="font-medium">{pokemon.name}</TableCell>
              <TableCell>{pokemon.url}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
