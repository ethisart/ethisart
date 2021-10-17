const fs = require("fs");
const { cwd } = require("process");
const { expect } = require("chai");
const { beforeEach } = require("mocha");
const { ethers } = require("hardhat");

describe("NFETH", function () {
  let contract;
  let owner;
  let wallet1;
  let wallet2;
  const wrapAmount = "1.0";
  const halfPrice = "0.01";
  
  beforeEach(async function () {
    const ColorsContract = await hre.ethers.getContractFactory("Colors");
    const colors = await ColorsContract.deploy();
    const NFETHContract = await hre.ethers.getContractFactory("NFETH", {
      libraries: { Colors: colors.address },
    });
    [owner, wallet1, wallet2] = await hre.ethers.getSigners();
    contract = await NFETHContract.deploy();
  });

  it("has name and symbol", async function () {
    expect(await contract.name()).to.equal("ETH IS ART");
    expect(await contract.symbol()).to.equal("NFETH");
  });

  it("has a grand total", async function () {
    expect(await contract.totalSupply()).to.equal(0);
    const contractAsWallet = await contract.connect(wallet1);
    await contractAsWallet.mintForSelf({
      value: ethers.utils.parseEther(wrapAmount),
    });
    expect(await contract.totalSupply()).to.equal(1);
  });



  it("can be crafted by anyone for themselves", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    await contractAsWallet.mintForSelf({
      value: ethers.utils.parseEther(wrapAmount),
    });
    expect(await contract.balanceOf(owner.address)).to.equal(0);
    expect(await contract.balanceOf(wallet1.address)).to.equal(1);
  });

  it("throws when price is too low", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    expect(
      contractAsWallet.mintForSelf({
        value: ethers.utils.parseEther("0.0001"),
      })
    ).to.be.revertedWith("PRICE_NOT_MET");

    // await expect(
    //   contractAsWallet.mintForFriend(wallet2.address, {
    //     value: ethers.utils.parseEther("0.0002"),
    //   })
    // ).to.be.revertedWith("PRICE_NOT_MET");
  });

  // it("can be crafted by anyone for someone else", async function () {
  //   const contractAsWallet = await contract.connect(wallet1);
  //   const token = await contractAsWallet.mintForFriend(wallet2.address, {
  //     value: ethers.utils.parseEther("0.0012"),
  //   });
  //   expect(await contract.balanceOf(owner.address)).to.equal(0);
  //   expect(await contract.balanceOf(wallet1.address)).to.equal(0);
  //   expect(await contract.balanceOf(wallet2.address)).to.equal(1);
  // });

  it("donator and owner receives revenue", async function () {
    //console.log(ethers.provider.getBalance(contractAsWallet.ownerRecipient()));
    const contractAsWallet = await contract.connect(owner);
    const preCreatorBalance = await ethers.provider.getBalance(contractAsWallet.creatorRecipient());
    const preDonationBalance = await ethers.provider.getBalance(contractAsWallet.donationRecipient());
    const price = ethers.utils.parseEther(halfPrice);
 
    await contractAsWallet.mintForSelf({
      value: ethers.utils.parseEther(wrapAmount),
    });  
    
    expect(await ethers.provider.getBalance(contractAsWallet.creatorRecipient())).to.equal(preCreatorBalance.add(price));
    expect(await ethers.provider.getBalance(contractAsWallet.donationRecipient())).to.equal(preDonationBalance.add(price));

  });

  it("redeems for ETH and only once", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    expect(await contract.balanceOf(wallet1.address)).to.equal(0)
    await contractAsWallet.mintForSelf({
      value: ethers.utils.parseEther(wrapAmount),
    });
    expect(await contract.balanceOf(wallet1.address)).to.equal(1)
    const tokenId = 1;  
    expect(contractAsWallet.redeemForEth(tokenId))
    //expect(await contract.balanceOf(wallet1.address)).to.equal(0)
    expect(contractAsWallet.redeemForEth(tokenId)).to.be.revertedWith("ERC721: owner query for nonexistent token");
  });

  it("token ids increment even after burn", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    expect(await contract.balanceOf(wallet1.address)).to.equal(0)
    await contractAsWallet.mintForSelf({
      value: ethers.utils.parseEther(wrapAmount),
    });
    expect(await contract.balanceOf(wallet1.address)).to.equal(1)
    const tokenId1 = 1;
    const tokenId2 = 2;  
    await contractAsWallet.redeemForEth(tokenId1);
    expect(await contract.balanceOf(wallet1.address)).to.equal(0);
    await contractAsWallet.mintForSelf({
      value: ethers.utils.parseEther(wrapAmount),
    });
    expect(await contractAsWallet.redeemForEth(tokenId2));
  });

  it("token counter works", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    expect(await contract.getSupply()).to.equal(0);
    await contractAsWallet.mintForSelf({
      value: ethers.utils.parseEther(wrapAmount),
    });
    expect(await contract.getSupply()).to.equal(1);
  });

  // To test this set max supply in contract to 5 and uncomment.
  // it("can only craft up to max", async function () {
  //   const contractAsWallet = await contract.connect(wallet1);
  //   expect(await contract.balanceOf(wallet1.address)).to.equal(0)
  //   await contractAsWallet.mintForSelf({
  //     value: ethers.utils.parseEther("0.0012"),
  //   });
  //   expect(await contract.balanceOf(wallet1.address)).to.equal(1)
  //   await contractAsWallet.mintForSelf({
  //     value: ethers.utils.parseEther("0.0012"),
  //   });
  //   expect(await contract.balanceOf(wallet1.address)).to.equal(2)
  //   await contractAsWallet.mintForSelf({
  //     value: ethers.utils.parseEther("0.0012"),
  //   });
  //   expect(await contract.balanceOf(wallet1.address)).to.equal(3)
  //   await contractAsWallet.mintForSelf({
  //     value: ethers.utils.parseEther("0.0012"),
  //   });
  //   expect(await contract.balanceOf(wallet1.address)).to.equal(4)
  //   expect(contractAsWallet.mintForSelf({
  //     value: ethers.utils.parseEther("0.0012"),
  //   })).to.be.revertedWith("MAX_REACHED");

  // });
  

  it("cannot redeem nfts of other", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    const contractAsWallet2 = await contract.connect(wallet2);
    const tokenId = 1;  
    expect(await contract.balanceOf(wallet1.address)).to.equal(0)
    await contractAsWallet.mintForSelf({value: ethers.utils.parseEther(wrapAmount),});
    expect(await contract.balanceOf(wallet1.address)).to.equal(1)
    expect(await contract.balanceOf(wallet2.address)).to.equal(0)
    expect(contractAsWallet2.redeemForEth(tokenId)).to.be.revertedWith("NOT OWNER");
  });

  it("it can redeem nfts that has been transferred", async function () {
    const contractAsWallet1 = await contract.connect(wallet1);
    const contractAsWallet2 = await contract.connect(wallet2);
    const tokenId = 1;
    expect(await contract.balanceOf(wallet1.address)).to.equal(0)
    await contractAsWallet1.mintForSelf({
      value: ethers.utils.parseEther(wrapAmount),
    });
    //await contractAsWallet1.approve(wallet2.address, tokenId);
    await contractAsWallet1.transferFrom(wallet1.address, wallet2.address, tokenId);
    expect(await contract.balanceOf(wallet1.address)).to.equal(0)
    expect(await contract.balanceOf(wallet2.address)).to.equal(1) 
    expect(contractAsWallet1.redeemForEth(tokenId)).to.be.revertedWith("NOT OWNER");
    await contractAsWallet2.redeemForEth(tokenId);
    expect(await contract.balanceOf(wallet2.address)).to.equal(0);
  });

  it("has a tokenUri", async function () {
    let i = 0;
    const amount = 1;

    while(i<=amount){
    
    const contractAsWallet = await contract.connect(wallet1);

    const token = await contractAsWallet.mintForSelf({value: ethers.utils.parseEther(wrapAmount),});
    
    const uri = await contract.tokenURI(i);
    expect(uri).to.match(/^data:/);

    const [pre, base64] = uri.split(",");
    const json = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
    expect(json["image"]).to.match(/^data:image\/svg/);

    const svg = Buffer.from(json["image"].split(",")[1], "base64").toString(
      "utf-8"
    );
    fs.writeFileSync(`./tmp/last-${i}.svg`, svg);
    console.log(cwd() + `/tmp/last-${i}.svg`);
    i++;
  }
  });
});
