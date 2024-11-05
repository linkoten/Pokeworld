import FetchPalParkArea from "@/app/components/location/FetchPalParkArea";

export default function Page({ params }: { params: { index: string } }) {
  const url = "pal-park-area";
  const completeUrl = `https://pokeapi.co/api/v2/${url}/${params.index}`;

  return (
    <>
      <div className=" text-center"> Pal-Park Area N° {params.index}</div>
      <FetchPalParkArea url={completeUrl} />
    </>
  );
}
