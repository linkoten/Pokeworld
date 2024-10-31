import DataList from "@/app/components/Data-List";
import React from "react";

export default function page() {
  const endpoint = "pokemon";
  return <DataList endpoint={endpoint} />;
}
