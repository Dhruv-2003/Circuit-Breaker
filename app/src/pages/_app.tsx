import Navbar from "@/components/navbar";
import Provider from "@/components/provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Provider>
        <Navbar />
        <Component {...pageProps} />
      </Provider>
      <Toaster richColors />
    </div>
  );
}
