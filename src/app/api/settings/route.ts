import { NextResponse } from "next/server";
import { getAllSettings, setSetting } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    for (const [key, value] of Object.entries(body)) {
      await setSetting(key, String(value));
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
