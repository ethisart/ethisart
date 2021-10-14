//export const address = "0xc3F5E8A98B3d97f19938E4673Fd97C7cfd155577"; // mainnet
export const address = "0x89972747F1F29dd74A519872308f430595eA9B84"; // rinkeby

export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "walletAddress",
        type: "address",
      },
    ],
    name: "craftForFriend",
    outputs: [],
    type: "function",
  },
  {
    inputs: [],
    name: "craftForSelf",
    outputs: [],
    type: "function",
  },
  {
    inputs: [],
    name: "currentYearTotalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    type: "function",
  },
];
