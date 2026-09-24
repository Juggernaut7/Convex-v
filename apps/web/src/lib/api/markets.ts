import { getAllMarkets, getMarket } from "@/lib/contracts/server";
import { MarketViewModel, OutcomeSide } from "@/types/market";
import { MarketType, MarketStatus, Outcome } from "@/lib/contracts/convex-manager";

const SEEDED_MARKET_METADATA: Record<number, { title: string; description: string; category: string }> = {
  0: { title: "Will Bitcoin close above $100,000 this month?", description: "A live Arc-native crypto market.", category: "Crypto" },
  1: { title: "Will the next major football final have over 2.5 goals?", description: "A live sports prediction market.", category: "Sports" },
  2: { title: "Will the next Arc ecosystem release ship this quarter?", description: "A live news and ecosystem market.", category: "Culture" },
};

function mapMarketStatus(status: MarketStatus): "Live" | "Closed" | "Resolved" | "Void" {
  switch (status) {
    case MarketStatus.Live:
      return "Live";
    case MarketStatus.Resolving:
      return "Closed";
    case MarketStatus.Resolved:
      return "Resolved";
    case MarketStatus.Void:
      return "Void";
    default:
      return "Live";
  }
}

function mapOutcome(outcome: Outcome): OutcomeSide | undefined {
  switch (outcome) {
    case Outcome.Yes:
      return "yes";
    case Outcome.No:
      return "no";
    default:
      return undefined;
  }
}

async function transformMarket(
  market: Awaited<ReturnType<typeof getMarket>>,
  metadata?: { title: string; description?: string; category: string } | null
): Promise<MarketViewModel | null> {
  if (!market) return null;

  const totalPool = market.yesPool + market.noPool;
  // Fix odds calculation: handle empty pools correctly
  const yesOdds = totalPool > 0n ? Number((market.yesPool * 10000n) / totalPool) / 100 : 50;
  const noOdds = totalPool > 0n ? Number((market.noPool * 10000n) / totalPool) / 100 : 50;

  return {
    id: market.marketId.toString(),
    onChainMarketId: market.marketId,
    title: metadata?.title || `Market #${market.marketId}`,
    description: metadata?.description || "",
    category: (metadata?.category as "Sports" | "Crypto" | "Culture") || (market.marketType === MarketType.Sports ? "Sports" : "Crypto"),
    closeTime: new Date(market.closeTime * 1000).toISOString(),
    resolveTime: market.resolveTime > 0 ? new Date(market.resolveTime * 1000).toISOString() : undefined,
    closesIn: market.closeTime > Date.now() / 1000 ? `${Math.floor((market.closeTime - Date.now() / 1000) / 3600)}h` : "Closed",
    totalPool: Number(totalPool) / 1e18,
    yesPool: Number(market.yesPool) / 1e18,
    noPool: Number(market.noPool) / 1e18,
    yesOdds,
    noOdds,
    yesMultiplier: yesOdds > 0 ? 100 / yesOdds : 0,
    noMultiplier: noOdds > 0 ? 100 / noOdds : 0,
    protocolFeeBps: market.protocolFeeBps,
    creatorFeeBps: market.creatorFeeBps,
    status: mapMarketStatus(market.status),
    winningOutcome: mapOutcome(market.winningOutcome),
    usesOracle: market.marketType === MarketType.Price,
    resolutionSource: market.marketType === MarketType.Price ? "oracle" : "manual",
    creator: market.creator,
    resolver: market.resolver,
    metadataURI: "",
    thresholdValue: null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date(market.closeTime * 1000 - 86400000).toISOString(),
    canStake: market.status === MarketStatus.Live && market.closeTime > Date.now() / 1000,
    resolverState: {
      source: market.marketType === MarketType.Price ? "oracle" : "manual",
      closeTimeReached: market.closeTime <= Date.now() / 1000,
      readyToResolve: market.status === MarketStatus.Live && market.closeTime <= Date.now() / 1000,
      canResolve: market.status === MarketStatus.Live && market.closeTime <= Date.now() / 1000,
    },
  };
}

export async function fetchMarkets(): Promise<MarketViewModel[]> {
  const markets = await getAllMarkets();
  const marketsWithMetadata = await Promise.all(
    markets.map(async (market) => {
      if (!market) return null;
      const metadata = SEEDED_MARKET_METADATA[market.marketId] ?? null;
      return await transformMarket(market, metadata);
    })
  );
  return marketsWithMetadata.filter((m): m is MarketViewModel => m !== null);
}

export async function fetchMarketById(id: string): Promise<MarketViewModel | null> {
  const marketId = parseInt(id, 10);
  if (isNaN(marketId)) return null;
  const market = await getMarket(marketId);
  if (!market) return null;
  const metadata = SEEDED_MARKET_METADATA[marketId] ?? null;
  return transformMarket(market, metadata);
}

export async function fetchMarketsClient(): Promise<MarketViewModel[]> {
  return fetchMarkets();
}

export type CreateMarketRequest = {
  title: string;
  description?: string;
  category: "sports" | "crypto" | "culture" | "custom";
  marketType: "price" | "event";
  closeTime: string;
  resolutionSource: "manual" | "oracle";
  thresholdValue?: number;
  eventReference?: string;
};

export async function createMarket(_body: CreateMarketRequest): Promise<MarketViewModel> {
  throw new Error("Market creation must be done on-chain via wallet. Use the create market form.");
}

