import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const treasuryAddress = process.env.TREASURY_ADDRESS;

export default buildModule("ConvexDeploymentModule", (m) => {
  const deployer = m.getAccount(0);
  const manager = m.contract("ConvexMarketManager", [treasuryAddress?.trim() || deployer]);
  const closeTime = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const seedMarkets = [
    [0, closeTime, deployer, 200, 100, "0x" + "01".repeat(32), "0x"],
    [1, closeTime, deployer, 200, 100, "0x" + "02".repeat(32), "0x"],
    [1, closeTime, deployer, 200, 100, "0x" + "03".repeat(32), "0x"],
  ] as const;

  seedMarkets.forEach((params, index) => {
    m.call(manager, "createMarket", [params], { id: `SeedMarket${index}`, from: deployer });
  });

  return { manager };
});
