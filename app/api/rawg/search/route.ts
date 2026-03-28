import { NextRequest, NextResponse } from "next/server";

const RAWG_API_KEY = process.env.RAWG_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=3`,
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "RAWG request failed" },
        { status: 500 },
      );
    }

    const data = await res.json();

    return NextResponse.json(data.results);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
