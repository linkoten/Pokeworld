import DataList from "@/app/components/Data-List";
import React from "react";

export default function page() {
  const endpoint = "pal-park-area";
  return <DataList endpoint={endpoint} />;
}
