import { type Address } from "viem";

function getEnv(
  name: string,
  { required = true, defaultValue }: { required?: boolean; defaultValue?: string } = {}
): string | undefined {
  const value = process.env[name];
  // Handle empty string, undefined, or whitespace-only values
  if (!value || value.trim().length === 0) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    if (required) {
      throw new Error(`Missing environment variable: ${name}`);
    }
    return undefined;
  }
  return value.trim();
}

export const MANAGER_CONTRACT_ADDRESS = getEnv("NEXT_PUBLIC_MANAGER_ADDRESS", {
  defaultValue: "0x0000000000000000000000000000000000000000",
}) as Address;
export const RPC_URL = getEnv("NEXT_PUBLIC_RPC_URL", {
  defaultValue: "https://rpc.mainnet.arc.io",
})!;
export const DEFAULT_CHAIN_ID = Number(
  getEnv("NEXT_PUBLIC_CHAIN_ID", { required: false, defaultValue: "5042" })
);

export const WALLET_CONNECT_PROJECT_ID = getEnv("NEXT_PUBLIC_WC_PROJECT_ID", { required: false });

export const RESOLVER_ADDRESS = getEnv("NEXT_PUBLIC_RESOLVER_ADDRESS", {
  required: false,
  defaultValue: "0xF39cE20c6A905157cF532890ed87b86f422774b7",
}) as Address;


