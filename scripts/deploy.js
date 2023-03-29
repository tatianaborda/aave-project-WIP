
const hre = require("hardhat");

async function main() {
  console.log('deploying');

  const PoolInteractions = await hre.ethers.getContractFactory('PoolInteractions');
  const poolInteractions = await PoolInteractions.deploy('0xeb7A892BB04A8f836bDEeBbf60897A7Af1Bf5d7F');

  await poolInteractions.deployed();

  console.log(
    `PoolInteractions deployed to ${poolInteractions.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
