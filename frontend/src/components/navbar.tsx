import React from "react";
import { CustomConnectWallet } from "./wallet-connect";

export default function Navbar() {
  return (
    <div className="py-4 max-w-7xl mx-auto flex items-center justify-between">
      <div className="text-3xl font-semibold ">Discovery Donar</div>
      <CustomConnectWallet />
    </div>
  );
}
