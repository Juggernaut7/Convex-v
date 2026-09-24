import { defineChain } from "viem";

import { DEFAULT_CHAIN_ID, RPC_URL } from "@/lib/constants";

export const arcMainnet = defineChain({
  id: DEFAULT_CHAIN_ID,
  name: "Arc Mainnet",
  nativeCurrency: { decimals: 18, name: "USDC", symbol: "USDC" },
  rpcUrls: {
    default: {
      http: [RPC_URL],
    },
    public: {
      http: [RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "Arc Explorer",
      url: "https://explorer.arc.io",
    },
  },
  testnet: false,
});


