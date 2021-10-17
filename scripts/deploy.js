async function main() {
  // We get the contract to deploy
  const Colors = await ethers.getContractFactory("Colors");
  const colors = await Colors.deploy();

  const NFETH = await ethers.getContractFactory("NFETH", {
    libraries: { Colors: colors.address },
  });
  const nfeth = await NFETH.deploy();

  console.log("Colors deployed to:", colors.address);
  console.log("NFETH deployed to:", nfeth.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
