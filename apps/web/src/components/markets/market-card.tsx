"use client";

import Link from "next/link";
import { Clock3, TrendingUp, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketViewModel } from "@/types/market";
import { formatNumber } from "@/lib/number";

type MarketCardProps = {
  market: MarketViewModel;
  onStake?: (market: MarketViewModel, choice: "yes" | "no") => void;
  compact?: boolean;
};

export function MarketCard({ market, onStake, compact = false }: MarketCardProps) {
  const isEnded = market.status === "Closed" || market.status === "Resolved" || market.status === "Void";

  return (
    <article className="group glass-panel flex h-full flex-col rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_70px_rgba(7,149,95,0.12)]">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/market/${market.id}`} className="block flex-1">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                {market.category}
              </span>
              {market.status === "Live" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />}
            </div>
            <p className="text-base font-semibold leading-snug text-white sm:text-lg">{market.title}</p>
          </Link>
          {isEnded && (
            <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-400">
              Ended
            </span>
          )}
        </div>
        {!compact && market.description && (
          <p className="text-sm leading-6 text-muted-foreground">{market.description}</p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4 text-primary" />
            {isEnded ? "Ended" : `Closes in ${market.closesIn}`}
          </span>
          <span className="inline-flex items-center gap-1 font-medium">
            <TrendingUp className="h-4 w-4 text-primary" />
            {formatNumber(market.totalPool)} USDC pool
          </span>
        </div>
        <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-rose-500/70">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
            style={{ width: `${market.yesOdds}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-medium">
          <span className="text-emerald-300">YES {market.yesOdds}%</span>
          <span className="text-rose-300">NO {market.noOdds}%</span>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
        <Button
          className="rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary/90"
          onClick={() => onStake?.(market, "yes")}
        >
          Bet YES · {market.yesMultiplier.toFixed(1)}x
        </Button>
        <Button
          variant="outline"
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 text-sm font-semibold text-rose-200 hover:bg-rose-500/20"
          onClick={() => onStake?.(market, "no")}
        >
          Bet NO · {market.noMultiplier.toFixed(1)}x <ArrowUpRight className="ml-1 inline h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
