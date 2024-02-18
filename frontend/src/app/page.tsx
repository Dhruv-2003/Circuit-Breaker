import UploadInput from "@/components/upload";
import Image from "next/image";

export default function Home() {
  return (
    <main className=" flex items-center justify-center h-full min-h-[80vh]">
      <UploadInput />
    </main>
  );
}
