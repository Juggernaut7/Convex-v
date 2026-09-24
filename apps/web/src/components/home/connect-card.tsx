"use client";

import { useMemo } from "react";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { PlugZap, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";

function formatAddress(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function ConnectWalletCard() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, status: connectStatus } = useConnect();
  const { disconnect } = useDisconnect();
  const hasConnector = connectors.length > 0;

  const injectedConnector = useMemo(
    () => connectors.find((connector) => connector.id === "injected"),
    [connectors]
  );

  const { data: usdcBalance, isLoading: isBalanceLoading } = useBalance({
    address,
    query: { enabled: Boolean(address) },
  });

  const isConnecting = connectStatus === "pending";

  return (
    <section className="glass-panel rounded-3xl p-6 shadow-sm sm:p-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Connect your wallet</h2>
          <span className="text-xs font-medium text-muted-foreground">
            {isConnected
              ? "Connected"
              : hasConnector
              ? "Wallet ready"
              : "No wallet found"}
          </span>
        </div>

        {!isConnected && (
          <p className="text-sm text-muted-foreground">
            {hasConnector
              ? "Connect with your preferred wallet to track stakes, manage markets, and claim payouts."
              : "No compatible wallet found. Install a browser wallet to continue."}
          </p>
        )}

        <div className="space-y-3">
          {isConnected ? (
            <>
              <div className="rounded-2xl border border-zinc-800 bg-secondary/50 p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Wallet
                </div>
                <div className="mt-1 text-sm font-medium text-white">
                  {address && formatAddress(address)}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>USDC balance</span>
                  <span className="font-semibold text-white">
                    {isBalanceLoading
                      ? "Loading..."
                      : Number(usdcBalance?.formatted || 0).toFixed(2)}{" "}
                    USDC
                  </span>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button className="rounded-2xl bg-secondary text-sm font-semibold text-white hover:bg-secondary/80">
                  View portfolio
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl border-zinc-700 bg-zinc-950 text-white hover:bg-zinc-800"
                >
                  Claim rewards
                </Button>
              </div>
            </>
          ) : (
            <Button
              disabled={!injectedConnector || isConnecting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#35D07F] text-base font-semibold text-white hover:bg-[#29b46e]"
              onClick={() => {
                if (!injectedConnector) return;
                connect({ connector: injectedConnector });
              }}
            >
              <Wallet className="h-5 w-5" />
              {isConnecting ? "Connecting..." : "Connect wallet"}
            </Button>
          )}

          {!hasConnector && (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#FBBF24] bg-[#FFFBEB] px-4 py-3 text-xs font-semibold text-[#B45309]">
              <PlugZap className="h-4 w-4" />
              Install a compatible wallet extension
            </div>
          )}
        </div>

        {isConnected && (
          <Button
            variant="ghost"
            className="w-full rounded-2xl border border-transparent bg-transparent text-sm font-semibold text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10"
            onClick={() => disconnect()}
          >
            Disconnect
          </Button>
        )}
      </div>
    </section>
  );
}


