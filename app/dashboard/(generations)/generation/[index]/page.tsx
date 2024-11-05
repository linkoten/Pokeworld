import FetchGeneration from "@/app/components/generation/FetchGeneration";

export default function Page({ params }: { params: { index: string } }) {
  const url = "generation";
  const completeUrl = `https://pokeapi.co/api/v2/${url}/${params.index}`;

  return (
    <>
      <div className=" text-center"> Generation {params.index}</div>
      <FetchGeneration url={completeUrl} />
    </>
  );
}
