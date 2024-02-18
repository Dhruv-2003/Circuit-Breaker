"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";

export const CustomConnectWallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant={"app"}
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    variant={"destructive"}
                    onClick={openChainModal}
                    type="button"
                    className="rounded-sm"
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <div className=" flex gap-3">
                  <Button
                    className="rounded-sm bg-transparent flex items-center gap-2"
                    variant={"outline"}
                    onClick={openChainModal}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div>
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>
                  <Button
                    variant={"app"}
                    onClick={openAccountModal}
                    // className="bg-gradient rounded-xl font-normal  text-white hover:opacity-90"
                    type="button"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
