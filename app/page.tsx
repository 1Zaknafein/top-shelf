import MainPage from "@/components/main-page";

async function getGames() {
  const res = await fetch("http://localhost:3000/api/games", {
    cache: "no-store",
  });

  return res.json();
}

export default async function Page() {
  const games = await getGames();

  return <MainPage initialGames={games} />;
}
