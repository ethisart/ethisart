// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";
import "./Colors.sol";

contract NFETH is ERC721, ERC721Enumerable {
  using Counters for Counters.Counter;
  using Colors for Colors.Color;
  using Strings for uint256;

  uint256 public constant MAX_ETHERPIECES = 10000;
  string public constant DESCRIPTION = "test";//TODO CHANGE TO:"ETH IS ART are limited supply of Ether wrapped as redeemable NFT artworks";
  uint256 public wrapAmount = 0.001 ether; //TODO CHANGE
  uint256 public price = 0.0002 ether; //TODO CHANGE
  uint256 public halfPrice = 0.0001 ether; //TODO CHANGE
  address public ownerRecipient = 0x62badb7E5363018166E60e62125d771cb27EAB06; //TODO CHANGE
  address public donationRecipient = 0x995047b7DD64e233Ea837C27d9e0450c6dc9Fe29; //TODO CHANGE
  

  Counters.Counter private _tokenIdCounter;
  mapping(uint256 => uint256[3]) private _seeds;

  constructor() ERC721("NFETH", "NFETH") {}

  function _mint(address destination) private {
    require(_tokenIdCounter.current() + 1 <= MAX_ETHERPIECES, "MAX_REACHED");

    uint256 tokenId = _tokenIdCounter.current()+1;
    uint256 destinationSeed = uint256(uint160(destination)) % 10000000;
    uint256 time = getCurrentTime();

    _safeMint(destination, tokenId);

    _seeds[tokenId][0] = time; 
    _seeds[tokenId][1] = tokenId;
    _seeds[tokenId][2] = destinationSeed;
    _tokenIdCounter.increment();
  }

  function craftForSelf() public payable virtual {
    require(msg.value >= (wrapAmount+price), "PRICE_NOT_MET");
    require(payable(ownerRecipient).send(halfPrice));
    require(payable(donationRecipient).send(halfPrice));
    _mint(msg.sender);
  }

  function craftForFriend(address walletAddress) public payable virtual {
    require(msg.value >= (wrapAmount+price), "PRICE_NOT_MET");
    require(payable(ownerRecipient).send(halfPrice));
    require(payable(donationRecipient).send(halfPrice));
    _mint(walletAddress);
  }

  function redeemForEth(uint256 tokenId) public {
    require(msg.sender == ERC721.ownerOf(tokenId), "NOT OWNER");
    _burn(tokenId);
    (bool success, ) = msg.sender.call{value: wrapAmount}("");
    require(success, "Failed to redeem Ether");
  }

  function getCurrentTime() private view returns (uint256) {
    return block.timestamp;
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    uint256[3] memory seed = _seeds[tokenId];
    string memory count = seed[1].toString();
    string memory colorSeed = string(abi.encodePacked(seed[0], seed[1], seed[2]));

    string memory c0seed = string(abi.encodePacked(colorSeed, "COLOR0"));
    Colors.Color memory base = Colors.fromSeedWithMinMax(c0seed, 0, 359, 100, 100, 50, 100);

    string memory c0 = base.toHSLString();
    string memory c1 = Colors.fromSeedWithMinMax(string(abi.encodePacked(colorSeed, "COLOR1")), base.hue - 30, base.hue - 40, 70, 90, 70, 85).toHSLString();
    string memory bg = Colors.fromSeedWithMinMax(string(abi.encodePacked(colorSeed, "BACKGROUND")), 160, 300, 30, 40, 10, 20).toHSLString();

    string[34] memory parts;
    parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" fill="none" preserveAspectRatio="yes"><rect width="2048" height="2048" fill="';
    parts[1] = bg;
    parts[2] = '" /> <g> <g opacity="1"> <g opacity="0.8" filter="url(#filter0_d)"> <path d="M1024.7,813l-474.3,216.9l474.4,281.8l474.1-281.8L1024.7,813z" ';
    parts[3] = 'fill="url(#paint0_linear" /> <path d="M1495.6,1030l-470.9,279.9L553.6,1030l471.1-215.4L1495.6,1030z" /> </g> </g> <g opacity="1"> ';
    parts[4] = '<path opacity="0.5" d="M1024.7,243.8V1309l-473.4-279.7L1024.7,243.8z" fill="url(#paint1_linear)" /> </g> <g opacity="1"> <path opacity="0.8" d="M1025.6,1309.1V243.8l473.2,785.5L1025.6,1309.1z" ';
    parts[5] = 'fill="url(#paint2_linear)" /> </g> <g> <g opacity="0.9"> <path opacity="0.45" d="M1024.7,1402.9v384.6l-470.2-662.4L1024.7,1402.9z" fill="url(#paint3_linear)" /> </g> ';
    parts[6] = '<g opacity="0.8"> <path opacity="0.8" d="M1496,1125.2l-470.4,662.4v-384.6L1496,1125.2z" fill="url(#paint4_linear)" /> </g> </g> </g> <defs> <filter id="filter0_d" x="397.138" y="812.954" width="1253.78"';
    parts[7] = ' height="1448.72" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" > <feFlood flood-opacity="0" result="BackgroundImageFix" /> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" ';
    parts[8] = 'result="hardAlpha" /> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" /> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" /> </filter> <linearGradient id="paint0_linear" x1="1024.03" ';
    parts[9] = 'y1="812.954" x2="1024.03" y2="1311.67" gradientUnits="userSpaceOnUse" > <stop stop-color="';
    parts[10] = c0;
    parts[11] = '" /> <stop offset="1" stop-color="';
    parts[12] = c1;
    parts[13] = '" /> </linearGradient> <linearGradient id="paint1_linear" x1="785.642" y1="238.446" x2="785.642" y2="1311.67" gradientUnits="userSpaceOnUse" > <stop stop-color="';
    parts[14] = c0;
    parts[15] = '" /> <stop offset="1" stop-color="';
    parts[16] = c1;
    parts[17] = '" /> </linearGradient> <linearGradient id="paint2_linear" x1="1262.52" y1="238.446" x2="1262.52" y2="1311.71" gradientUnits="userSpaceOnUse" > <stop stop-color="';
    parts[18] = c0;
    parts[19] = '" /> <stop offset="1" stop-color="';
    parts[20] = c1;
    parts[21] = '" /> </linearGradient> <linearGradient id="paint2_linear" x1="1262.52" y1="238.446" x2="1262.52" y2="1311.71" gradientUnits="userSpaceOnUse" > <stop stop-color="';
    parts[22] = c0;
    parts[23] = '" /> <stop offset="1" stop-color="';
    parts[24] = c1;
    parts[25] = '" /> </linearGradient> <linearGradient id="paint3_linear" x1="785.642" y1="1120.27" x2="785.642" y2="1792.28" gradientUnits="userSpaceOnUse" > <stop stop-color="';
    parts[26] = c0;
    parts[27] = '" /> <stop offset="1" stop-color="';
    parts[28] = c1;
    parts[29] = '" /> </linearGradient> <linearGradient id="paint4_linear" x1="1262.72" y1="1120.29" x2="1262.72" y2="1792.29" gradientUnits="userSpaceOnUse" > <stop stop-color="';
    parts[30] = c0;
    parts[31] = '" /> <stop offset="1" stop-color="';
    parts[32] = c1;
    parts[33] = '" /> </linearGradient></defs></svg>';

    string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9], parts[10]));
    output = string(abi.encodePacked(output, parts[11], parts[12], parts[13], parts[14], parts[15], parts[16], parts[17], parts[18], parts[19], parts[20]));
    output = string(abi.encodePacked(output, parts[21], parts[22], parts[23], parts[24], parts[25], parts[26], parts[27], parts[28], parts[29], parts[30]));
    output = string(abi.encodePacked(output, parts[31], parts[32], parts[33]));

    output = Base64.encode(bytes(string(abi.encodePacked('{"name":"test #', count, '","description":"', DESCRIPTION, '","image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
    output = string(abi.encodePacked("data:application/json;base64,", output));

    return output;
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
  // The following functions are overrides required by Solidity.
  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
