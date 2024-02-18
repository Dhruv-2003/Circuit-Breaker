import { getPDFEmails } from "@/utils/pdfUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    console.log(body);

    const { url } = body;

    if (!url) {
      return new Response("URL missing", { status: 400 });
    }

    const data = await getPDFEmails(url);
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
