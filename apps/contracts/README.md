# Convex Arc Mainnet Contracts

Native USDC prediction market contracts for Arc Mainnet.

## Quick Start

```bash
pnpm install
pnpm compile
pnpm test
pnpm deploy:arc
```

## Network

- Chain ID: 5042
- RPC URL: https://rpc.mainnet.arc.io
- Explorer: https://explorer.arc.io
- Currency: native USDC with 18 decimals

## Environment

Configure `apps/contracts/.env` with a deployer key and treasury address:

```env
PRIVATE_KEY=your_private_key
TREASURY_ADDRESS=your_treasury_address
ARCSCAN_API_KEY=your_arcscan_api_key
```

Never commit real private keys or API keys.

## Deployment

```bash
pnpm --filter hardhat deploy:arc
```

The deployment script automatically confirms the Arc Mainnet network prompt.

## Contract

`ConvexMarketManager.sol` creates markets, accepts native USDC stakes through `msg.value`, resolves outcomes, and pays proportional winnings directly to users.

## Documentation

- [Hardhat Documentation](https://hardhat.org/docs)
- [Arc Documentation](https://docs.arc.network)
- [Viem Documentation](https://viem.sh)
