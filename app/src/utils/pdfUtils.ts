import * as pdfjsLib from "pdfjs-dist";

export async function getPDFText(url: string): Promise<string | undefined> {
  const mockURL = "https://arxiv.org/pdf/2004.00001.pdf";
  const res = await fetch(url);
  console.log(res);

  if (!res.ok) {
    throw new Error("Failed to fetch PDF");
  }

  const pdfData = await res.arrayBuffer();
  try {
    const pdf = await pdfjsLib.getDocument(pdfData).promise;
    const numPages = pdf.numPages;

    // Extract text from each page
    let text = "";
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      content.items.forEach((item) => {
        // @ts-ignore
        text += item.str + "\n";
      });
    }
    console.log(text);
    return text;
  } catch (error) {
    console.log(error);
  }
}

export async function getPDFEmails(url: string): Promise<string[] | undefined> {
  const mockURL = "https://arxiv.org/pdf/2004.00001.pdf";
  const res = await fetch(url);
  console.log(res);

  if (!res.ok) {
    throw new Error("Failed to fetch PDF");
  }

  const pdfData = await res.arrayBuffer();
  try {
    const pdf = await pdfjsLib.getDocument(pdfData).promise;
    const numPages = pdf.numPages;

    // Extract emails from all the pages
    let emails: string[] = [];
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      content.items.forEach((item) => {
        const emailRegex =
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        // @ts-ignore
        const matches = item.str.match(emailRegex);
        if (matches) {
          emails.push(...matches);
        }
      });
    }

    return emails;
  } catch (error) {
    console.log(error);
  }
}

export const url = "https://arxiv.org/pdf/2402.10172.pdf";

// getPDFEmails(url)
//   .then((text) => {
//     console.log(text);
//   })
//   .catch((error) => {
//     console.error("Error:", error.message);
//   });
