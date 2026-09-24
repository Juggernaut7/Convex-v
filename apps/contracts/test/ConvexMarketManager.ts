import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

const ONE_USDC = 10n ** 18n;

async function deployFixture() {
  const [deployer, creator, resolver, alice, bob, treasury] = await ethers.getSigners();
  const Manager = await ethers.getContractFactory("ConvexMarketManager");
  const manager = await Manager.deploy(treasury.address);
  await manager.waitForDeployment();

  await manager.grantRole(await manager.CREATOR_ROLE(), creator.address);
  await manager.grantRole(await manager.RESOLVER_ROLE(), resolver.address);

  const closeTime = (await time.latest()) + 3600;
  await manager.connect(creator).createMarket({
    marketType: 1,
    closeTime,
    resolver: resolver.address,
    protocolFeeBps: 0,
    creatorFeeBps: 0,
    metadataHash: ethers.keccak256(ethers.toUtf8Bytes("arc-sports-market")),
    extraData: "0x",
  });

  return { manager, deployer, creator, resolver, alice, bob, treasury, closeTime };
}

describe("ConvexMarketManager", function () {
  it("accepts native value without an ERC-20 approval", async function () {
    const { manager, alice } = await loadFixture(deployFixture);
    const amount = 5n * ONE_USDC;

    await expect(manager.connect(alice).stake(0, 1, amount, { value: amount }))
      .to.emit(manager, "StakePlaced")
      .withArgs(0, alice.address, 1, amount);

    const market = await manager.markets(0);
    expect(market.yesPool).to.equal(amount);
  });

  it("resolves and pays winning claims in native value", async function () {
    const { manager, resolver, alice, bob, closeTime } = await loadFixture(deployFixture);
    const aliceStake = 10n * ONE_USDC;
    const bobStake = 5n * ONE_USDC;

    await manager.connect(alice).stake(0, 1, aliceStake, { value: aliceStake });
    await manager.connect(bob).stake(0, 2, bobStake, { value: bobStake });
    await time.increaseTo(closeTime + 1);
    await manager.connect(resolver).resolveMarket(0, 1);

    const before = await ethers.provider.getBalance(alice.address);
    const transaction = await manager.connect(alice).claim(0);
    const receipt = await transaction.wait();
    const gasCost = receipt!.gasUsed * receipt!.gasPrice;
    const after = await ethers.provider.getBalance(alice.address);

    expect(after + gasCost - before).to.equal(aliceStake + bobStake);
    await expect(manager.connect(bob).claim(0)).to.be.revertedWithCustomError(manager, "NothingToClaim");
  });

  it("rejects a stake whose value does not match its amount", async function () {
    const { manager, alice } = await loadFixture(deployFixture);
    await expect(manager.connect(alice).stake(0, 1, ONE_USDC, { value: 0 }))
      .to.be.revertedWithCustomError(manager, "ZeroAmount");
  });
});
