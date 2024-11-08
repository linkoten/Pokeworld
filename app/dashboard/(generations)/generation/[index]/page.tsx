import Pokedex from "@/app/components/generation/Pokedex";

export default async function Page({ params }: { params: { index: string } }) {
  const url = "generation";
  const completeUrl = `https://pokeapi.co/api/v2/${url}/${params.index}`;

  const response = await fetch(completeUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return (
    <>
      <div className=" text-center"> Generation {params.index}</div>
      <Pokedex generationData={data} />
    </>
  );
}
