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
import Link from "next/link";

interface Data {
  name: string;
  url: string;
}

export default function DataList({ endpoint }: { endpoint: string }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  console.log("un url", endpoint);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  async function fetchData(page: number) {
    const offset = (page - 1) * 20;
    const response = await fetch(
      `https://pokeapi.co/api/v2/${endpoint}?offset=${offset}&limit=20`
    );
    const data = await response.json();
    setData(data.results);
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
          {data.map((data: Data, index: number) => (
            <TableRow key={data.name}>
              <TableCell>{(currentPage - 1) * 20 + index + 1}</TableCell>
              <TableCell className="font-medium">{data.name}</TableCell>
              <TableCell>
                {" "}
                <Link href={`/dashboard/${endpoint}/${index + 1}`}>
                  {data.url}
                </Link>
              </TableCell>
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
