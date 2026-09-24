"use client";

import { BadgeCheck, CircleDashed, DownloadCloud, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";
import { useUserPositions } from "@/lib/hooks/use-user-positions";

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() / 1000 - timestamp));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function DashboardPredictions() {
  const { isConnected } = useAccount();
  const { positions, isLoading } = useUserPositions();
  return (
    <section className="glass-panel space-y-6 rounded-3xl p-6 shadow-sm sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">Recent predictions</h2>
          <p className="text-sm text-muted-foreground">Monitor positions and download history.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full border-zinc-700 bg-secondary text-sm font-semibold text-white hover:bg-zinc-800"
          >
            <DownloadCloud className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-full border-zinc-700 bg-secondary text-sm font-semibold text-white hover:bg-zinc-800"
          >
            <ExternalLink className="h-4 w-4" />
            View on-chain
          </Button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="min-w-[760px] divide-y divide-zinc-800">
          <thead className="bg-secondary/60">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-6 py-3">Market</th>
              <th className="px-6 py-3">Stake</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Potential / payout</th>
              <th className="px-6 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-sm text-muted-foreground">
            {!isConnected ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#6B7280]">
                  Connect your wallet to see your predictions
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#6B7280]">
                  Loading your positions...
                </td>
              </tr>
            ) : positions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#6B7280]">
                  You haven't placed any stakes yet. Browse markets to get started!
                </td>
              </tr>
            ) : (
              positions.map((position) => {
                const createdAt = position.market.createdAt
                  ? formatTimeAgo(Math.floor(new Date(position.market.createdAt).getTime() / 1000))
                  : "Recently";

                return (
                  <tr key={position.market.id} className="transition hover:bg-[#F9FAFB]">
                    <td className="px-6 py-4 text-[#111827]">
                      <Link href={`/market/${position.market.id}`} className="hover:underline">
                        {position.market.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{(Number(position.totalStake) / 1e18).toFixed(2)} USDC</td>
                    <td className="px-6 py-4">
                      {position.market.status === "Live" || position.market.status === "Closed" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#111827]">
                          <CircleDashed className="h-3.5 w-3.5 text-[#35D07F]" />
                          Awaiting result
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F7EF] px-3 py-1 text-xs font-semibold text-[#217756]">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Settled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {position.canClaim ? (
                        <span className="font-semibold text-[#217756]">
                          Won {position.potentialPayout.toFixed(2)} USDC
                        </span>
                      ) : (
                        <span className="font-semibold text-[#111827]">
                          {position.potentialPayout > 0 ? `${position.potentialPayout.toFixed(2)} USDC` : "--"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#6B7280]">{createdAt}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}


