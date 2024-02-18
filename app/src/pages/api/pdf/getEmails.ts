import { getPDFEmails } from "@/utils/pdfUtils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const body = await req.body;
    console.log(body);

    const { url } = body;

    // if (!url) {
    //   return new Response("URL missing", { status: 400 });
    // }

    const data = await getPDFEmails(url);
    console.log(data);
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
