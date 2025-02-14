import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tmdb, type } = body;
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${tmdb}?language=vi-VN`, {
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}` },
    });
    const data = await res.json();
    // console.log('---->dataApiTmdb:', data);
    return NextResponse.json(data);
  } catch (error) {
    // return NextResponse.error(error);
    console.log('---->error:', error);
  }
}
