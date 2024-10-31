export default async function FetchPokemon({ url }: { url: string }) {
  console.log("je suis l'url", url);
  let data = await fetch(url);
  let posts = await data.json();

  console.log(posts);
  return <div>YO</div>;
}
