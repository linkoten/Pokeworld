import DataList from "@/app/components/Data-List";
import React from "react";

export default function page() {
  const endpoint = "generation";
  return <DataList endpoint={endpoint} />;
}
