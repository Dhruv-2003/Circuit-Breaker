"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  File,
  FileQuestionIcon,
  LucideIcon,
  Upload,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useDropzone } from "react-dropzone";
import PdfViewer from "./pdf-viewer";
import { getDocument, PDFDocumentProxy } from "pdfjs-dist";
import { Button } from "./ui/button";

interface Steps {
  title: string;
  icon: LucideIcon;
}
const steps: Steps[] = [
  {
    title: "Enter Details",
    icon: File,
  },
  {
    title: "Confirm Details",
    icon: FileQuestionIcon,
  },
  {
    title: "Success",
    icon: CheckCircle2,
  },
];

export default function UploadInput() {
  const [activeStep, setActiveStep] = useState(0);
  const [fileData, setFileData] = useState<string | ArrayBuffer | null>(null);
  const [emails, setEmails] = useState<string[]>([]);
  const [percentage, setPercentage] = useState<number>(0);
  const [emailPercentages, setEmailPercentages] = useState<
    { email: string; percentage: number }[]
  >([]);

  const handleClick = (idx: number) => {
    setActiveStep(idx);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const reader = new FileReader();

    reader.onload = async () => {
      if (reader.result) {
        setFileData(reader.result as string | ArrayBuffer);
        extractEmails(reader.result as string);
      }
    };
    reader.readAsDataURL(acceptedFiles[0]);
  };

  const extractEmails = async (content: string) => {
    try {
      const pdfContent = atob(content.split(",")[1]);
      const pdfDocument = (await getDocument({ data: pdfContent })
        .promise) as PDFDocumentProxy;
      const numPages = pdfDocument.numPages;
      let extractedEmails: string[] = [];
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        textContent.items.forEach((item: any) => {
          const text = item.str;
          const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
          const matches = text.match(emailRegex);
          if (matches) {
            extractedEmails = extractedEmails.concat(matches);
          }
        });
      }
      setEmails(extractedEmails);
      setEmailPercentages(
        extractedEmails.map((email) => ({ email, percentage: 0 }))
      );
    } catch (error) {
      console.error("Error extracting emails:", error);
    }
  };

  const handlePercentageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newEmailPercentages = [...emailPercentages];
    newEmailPercentages[index].percentage = Number(event.target.value);
    setEmailPercentages(newEmailPercentages);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = () => {
    // Handle submission of email percentages
    console.log(emailPercentages);
  };

  return (
    <div className="w-full">
      <div className="w-7/12 mx-auto space-y-8">
        <ol className="flex items-center justify-between w-full text-base font-medium text-center">
          {steps.map(({ icon: Icon, title }, idx) => (
            <>
              <li
                key={idx}
                className={cn(
                  "flex md:w-full items-center text-center w-full",
                  idx !== activeStep && "text-gray-500",
                  idx <= activeStep && "text-[#BAEF58]"
                )}
                onClick={() => handleClick(idx)}
              >
                <div className="w-40 text-center">
                  <span className="flex items-center justify-center gap-2">
                    <Icon className="size-6" />
                    {title}
                  </span>
                </div>
              </li>
              {idx < steps?.length - 1 ? (
                <Separator className="mx-3 max-w-[155px] bg-gray-500" />
              ) : (
                ""
              )}
            </>
          ))}
        </ol>
        <div className="flex items-start justify-center flex-col gap-5 bg-transparent border border-white p-10">
          {!fileData && (
            <>
              <Label className="w-full space-y-2">
                <div className="text-base">Enter file URL below</div>
                <Input type="text" placeholder="Enter PDF or Arvix link" />
              </Label>
              <div className=" self-center text-lg font-semibold text-neutral-300">
                or
              </div>

              <div
                {...getRootProps()}
                className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed min-h-[100px] p-6 px-20 group text-center w-full"
              >
                <div className="w-full text-center flex flex-col justify-center items-center">
                  <Upload className="size-8" />
                  <span className="text-sm mt-2">Drop file here</span>
                </div>
                <input {...getInputProps()} className="hidden" />
              </div>
            </>
          )}
          {fileData && (
            <div className=" space-y-3 w-full">
              <div className=" text-lg font-semibold tracking-wide">
                View PDF
              </div>
              <div className="w-full">
                <PdfViewer url={fileData} />
              </div>
            </div>
          )}

          <div className=" w-full space-y-2">
            <div className=" text-lg font-semibold tracking-wide">
              Emails extracted from PDF:
            </div>
            <div className=" space-y-3 w-full">
              {emails.map((email, index) => (
                <div key={index} className=" flex items-center w-full gap-5">
                  <Input
                    type="text"
                    value={email}
                    disabled
                    className=" text-black w-full"
                  />
                  <div className=" flex items-center gap-2">
                    <Input
                      type="number"
                      value={emailPercentages[index]?.percentage || ""}
                      onChange={(e) => handlePercentageChange(e, index)}
                      placeholder="e.g: 40"
                      className=" w-32 text-black"
                    />
                    <div>%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button variant={"app"} className=" w-full" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
