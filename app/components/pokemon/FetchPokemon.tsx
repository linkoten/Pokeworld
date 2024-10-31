export default async function FetchPokemon({ url }: { url: string }) {
  console.log("je suis l'url", url);
  const data = await fetch(url);
  const posts = await data.json();

  console.log(posts);
  return <div>YO</div>;
}
