import Link from "next/link";

import { Container } from "@/components/layout/container";
import { MarketGallery } from "@/components/markets/market-gallery";
import { Button } from "@/components/ui/button";
import { fetchMarkets } from "@/lib/api/markets";
import { getTrendingMarkets } from "@/lib/markets/trending";

// Revalidate every 10 seconds to get fresh market data
export const revalidate = 10;

export default async function MarketsPage() {
  const markets = await fetchMarkets();
  const trendingMarkets = getTrendingMarkets(markets, 4);

  return (
    <main className="arc-grid min-h-screen pb-24 pt-10 sm:pt-14">
      <Container className="space-y-12 lg:space-y-16">
        <header className="space-y-5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Markets
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Find your edge.
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Browse live pools across sports, crypto, and culture. Stake your conviction in seconds with wallet-native UX.
            </p>
          </div>
          <Button
            asChild
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            <Link href="/create">Create market</Link>
          </Button>
        </header>

        <MarketGallery markets={markets} initialCategory="All" trendingMarkets={trendingMarkets} />
      </Container>
      <Link
        href="/create"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-primary/90"
      >
        <span>+ Create market</span>
      </Link>
    </main>
  );
}
