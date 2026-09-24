"use client";

import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit";
import { useConnect } from "wagmi";
import { Button } from "./ui/button";

export function ConnectButton() {
  const { connect } = useConnect();

  return (
    <RainbowKitConnectButton.Custom>
      {({ account, chain, mounted, openAccountModal, openConnectModal }) => {
        const connected = mounted && account && chain;

        return (
          <Button
            className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary/80"
            onClick={() => {
              if (!connected) {
                openConnectModal();
              } else {
                openAccountModal();
              }
            }}
          >
            {connected ? account.displayName : "Connect wallet"}
          </Button>
        );
      }}
    </RainbowKitConnectButton.Custom>
  );
}

// Provide a backwards-compatible alias used elsewhere in the app
export const WalletConnectButton = ConnectButton;
