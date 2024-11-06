import DataList from "@/app/components/pokemon/Test";
import React from "react";

export default function page() {
  const endpoint = "pokemon";
  return <DataList endpoint={endpoint} />;
}
