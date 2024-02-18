"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Suspense } from "react";

// @ts-ignore
const PdfViewer = ({ url }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className=" h-[250px] w-full">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      </div>
    </Suspense>
  );
};

export default PdfViewer;
