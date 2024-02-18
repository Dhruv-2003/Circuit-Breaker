"use client";

import { Suspense, lazy } from "react";
import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  File,
  FileQuestionIcon,
  LucideIcon,
  Upload,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDropzone } from "react-dropzone";
import { getDocument, PDFDocumentProxy } from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PdfViewer from "@/components/pdf-viewer";

const tokens = [
  {
    name: "TEST",
    value: "TEST",
  },
  {
    name: "USDC",
    value: "USDC",
  },
  {
    name: "DAI",
    value: "DAI",
  },
];

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

export default function AllSteps() {
  const [pdfURL, setPdfURL] = useState<string>();
  const [activeStep, setActiveStep] = useState(0);
  const [fileData, setFileData] = useState<string | ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [emails, setEmails] = useState<string[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [emailPercentages, setEmailPercentages] = useState<
    { email: string; percentage: number }[]
  >([]);

  const handleClick = (idx: number) => {
    if (!fileData) return toast.error("No file selected");
    setActiveStep(idx);
  };

  function handleTokenChange(token: string) {
    setSelectedToken(token);
  }

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
      // setEmailPercentages(
      //   extractedEmails.map((email) => ({ email, percentage: 100 }))
      // );
      const percentage =
        extractedEmails.length > 1 ? 100 / extractedEmails.length : 100;
      setEmailPercentages(
        extractedEmails.map((email) => ({ email, percentage }))
      );
    } catch (error) {
      console.error("Error extracting emails:", error);
    }
  };

  const extractEmailsFromUrl = async (url: string) => {
    try {
      const data = {
        url,
      };
      const res = await fetch("/api/pdf/getEmails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log(res);
      const newData = await res.json();
      console.log(newData);
      const extractedEmails = newData.data;
      console.log(extractedEmails);
      setEmails(extractedEmails);
      // setEmailPercentages(
      //   extractedEmails.map((email) => ({ email, percentage: 100 }))
      // );
      const percentage =
        extractedEmails.length > 1 ? 100 / extractedEmails.length : 100;
      setEmailPercentages(
        extractedEmails.map((email: string) => ({ email, percentage }))
      );
    } catch (error) {
      console.log(error);
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

  const moveToStep2 = () => {
    // if (!fileData) return toast.error("No file selected");
    setActiveStep(activeStep + 1);
  };

  const moveToStep3 = () => {
    if (!donationAmount && !selectedToken) {
      return toast.error("Please enter donation amount & token");
    }
    setActiveStep(activeStep + 1);
  };

  return (
    <div className="w-full min-h-screen  py-20 flex items-start justify-center">
      <div className="w-7/12 mx-auto space-y-8">
        <ol className="flex items-center justify-between w-full text-base font-medium text-center">
          {steps.map(({ icon: Icon, title }, idx) => (
            <>
              <li
                key={idx}
                className={cn(
                  "flex md:w-full items-center text-center w-full cursor-pointer",
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

        {/* step 1 */}
        {activeStep === 0 && (
          <div className="flex items-start justify-center flex-col gap-5 bg-transparent border border-white p-10">
            {!fileData && (
              <>
                <Label className="w-full space-y-2">
                  <div className="text-base">Enter file URL below</div>
                  <div className=" flex items-center gap-3">
                    <Input
                      type="text"
                      placeholder="Enter PDF or Arvix link"
                      className=" text-black"
                      onChange={(e) => setPdfURL(e.target.value)}
                    />
                    <Button
                      onClick={() => extractEmailsFromUrl(pdfURL as string)}
                      variant={"app"}
                    >
                      Get Emails
                    </Button>
                  </div>
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
                  <Input {...getInputProps()} className="hidden" />
                </div>
              </>
            )}
            {fileData && (
              <div className=" space-y-3 w-full">
                <div className=" text-lg font-semibold tracking-wide">
                  Selected File
                </div>
                <Card className="w-full break-all">
                  {fileName}
                  {/* <Suspense fallback={<div>Loading...</div>}>
                    <PdfViewer url={fileData} />
                  </Suspense> */}
                  {/* <PdfViewer url={fileData} /> */}
                </Card>
              </div>
            )}
            {!!emails.length && (
              <div className=" w-full space-y-2">
                <div className=" text-lg font-semibold tracking-wide">
                  Emails extracted from PDF:
                </div>
                <div className=" space-y-3 w-full">
                  {emails.map((email, index) => (
                    <div
                      key={index}
                      className=" flex items-center w-full gap-3"
                    >
                      <Input
                        type="text"
                        value={email}
                        disabled
                        className=" text-black w-[60%]"
                      />
                      <div className=" flex items-center gap-3">
                        <div>gets</div>
                        <Input
                          type="number"
                          value={emailPercentages[index]?.percentage || ""}
                          onChange={(e) => handlePercentageChange(e, index)}
                          placeholder="e.g: 40"
                          className=" w-32 text-black"
                        />
                        <div className=" min-w-fit">% of the funds</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button
              variant={"app"}
              className="mt-5 w-full"
              onClick={moveToStep2}
            >
              Next
            </Button>
          </div>
        )}

        {/* step 2 */}
        {activeStep === 1 && (
          <div className="flex items-start justify-center flex-col gap-5 bg-transparent border border-white p-10">
            <div className=" text-2xl text-center mx-auto font-semibold tracking-wide">
              Confirm Payment Details
            </div>
            {fileData && (
              <div className=" space-y-3 w-full">
                <div className="w-full">
                  {/* <PdfViewer url={fileData} /> */}
                  {/* <Suspense fallback={<div>Loading...</div>}>
                    <PdfViewer url={fileData} />
                  </Suspense> */}
                </div>
              </div>
            )}

            {!!emails.length && (
              <div className=" w-full space-y-2">
                <div className=" text-lg font-semibold tracking-wide">
                  Emails extracted from PDF:
                </div>
                <div className=" space-y-3 w-full">
                  {emails.map((email, index) => (
                    <div
                      key={index}
                      className=" flex items-center w-full gap-3"
                    >
                      <Input
                        type="text"
                        value={email}
                        disabled
                        className=" text-black w-[60%]"
                      />
                      <div className=" flex items-center gap-3">
                        <div>gets</div>
                        <Input
                          type="number"
                          value={emailPercentages[index]?.percentage || ""}
                          onChange={(e) => handlePercentageChange(e, index)}
                          placeholder="e.g: 40"
                          disabled
                          className=" w-32 text-black"
                        />
                        <div className=" min-w-fit">% of the funds</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Card className="space-y-5 w-full p-8 rounded-md border-2 border-indigo-900 bg-[#f9fbfa]">
              <Select
                value={selectedToken}
                onValueChange={(value) => setSelectedToken(value)}
              >
                <SelectTrigger className="border-2 border-black">
                  <SelectValue placeholder="Select Token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token, idx) => (
                    <SelectItem key={idx} value={token.value}>
                      {token.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                <Label className="w-full space-y-2">
                  <div className="text-base">
                    Enter donation amount{" "}
                    <span className=" text-sm">{`( in $ )`}</span>
                  </div>
                  <Input
                    placeholder="e.g: 100"
                    className=" border-2 border-black text-black"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                  />
                </Label>
              </div>
            </Card>
            <Button
              variant={"app"}
              className=" w-full mt-4 text-base font-semibold"
              onClick={moveToStep3}
            >
              Send Donation
            </Button>
          </div>
        )}

        {/* step 3 */}
        {activeStep === 2 && (
          <div className="flex items-start justify-center flex-col gap-5 bg-transparent border border-white p-10">
            {!!emails.length && (
              <div className=" w-full space-y-2">
                <div className=" text-lg font-semibold tracking-wide">
                  Emails extracted from PDF:
                </div>
                <div className=" space-y-3 w-full">
                  {emails.map((email, index) => (
                    <div
                      key={index}
                      className=" flex items-center justify-between w-full gap-3"
                    >
                      <div className=" flex items-center gap-3">
                        <div>{email}</div>
                        <div>gets</div>
                        <Input
                          type="number"
                          value={
                            (emailPercentages[index]?.percentage *
                              donationAmount) /
                              100 || ""
                          }
                          onChange={(e) => handlePercentageChange(e, index)}
                          placeholder="e.g: 40"
                          disabled
                          className=" w-32 text-black"
                        />
                        <div className=" min-w-fit">{selectedToken}</div>
                      </div>
                      <a
                        href={`https://mail.google.com/mail/?&view=cm&fs=1&to=${
                          email.split("@")[0]
                        }%40${
                          email.split("@")[1]
                        }&cc=sepolia%40sendeth.org&su=Send%20${
                          (emailPercentages[index]?.percentage *
                            donationAmount) /
                          100
                        }%20${selectedToken}%20to%20${email.split("@")[0]}%40${
                          email.split("@")[1]
                        }&body=${`Thank%20You%20for%20your%20Contribution%20on%20the%20research%20paper%20`}${pdfURL}%0A%0AYou%20are%20sending%20with%20Email%20Wallet.%0A%0A%E2%9D%97%20This%20transaction%20is%20triggered%20when%20you%20send%20this%20email.%20Don%27t%20edit%20the%20cc%3A%20or%20subject%3A%20fields%2C%20or%20else%20it%20will%20fail!%0A%0A%F0%9F%93%A4%20sendeth.org%20(cc%27d)%20relays%20your%20email%20on%20Sepolia%20testnet%20to%20transfer%20the%20funds.%20Expect%20a%20confirmation%20email%20when%20finished.%0A%0A%F0%9F%93%96%20Read%20more%20on%20our%20site%2C%20docs%2C%20or%20code%20at%20https%3A%2F%2Femailwallet.org`}
                        className=" self-end ml-auto"
                      >
                        Send Email
                      </a>
                      <Button variant={"app"} className=" self-end ml-auto">
                        Send Email
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <CheckCircle2 className=" w-20 h-20 text-[#BAEF58] mx-auto" />
            <div className=" text-xl text-center mx-auto font-semibold tracking-wide">
              Transation Initiated Successfully
            </div>
            <p className=" mx-auto ">
              We will inform you via mail once the recipients get the donation.{" "}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
