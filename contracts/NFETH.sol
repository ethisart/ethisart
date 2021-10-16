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
  string public constant DESCRIPTION = "ETH IS ART are limited supply of Ether wrapped as redeemable NFT artworks";
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

  function mintForSelf() public payable virtual {
    require(msg.value == (wrapAmount+price), "PRICE_NOT_MET");
    require(payable(ownerRecipient).send(halfPrice));
    require(payable(donationRecipient).send(halfPrice));
    _mint(msg.sender);
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

  function getSupply() public view returns (uint256) {
    return _tokenIdCounter.current();
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    uint256[3] memory seed = _seeds[tokenId];
    string memory count = seed[1].toString();
    string memory colorSeed = string(abi.encodePacked(seed[0], seed[1], seed[2]));

    string memory c0seed = string(abi.encodePacked(colorSeed, "COLOR0"));
    Colors.Color memory base = Colors.fromSeedWithMinMax(c0seed, 0, 359, 100, 100, 50, 100);

    string memory c0 = base.toHSLString();
    string memory c1 = Colors.fromSeedWithMinMax(string(abi.encodePacked(colorSeed, "COLOR1")), base.hue - 30, base.hue - 40, 100, 100, 50, 100).toHSLString();
    string memory bg = Colors.fromSeedWithMinMax(string(abi.encodePacked(colorSeed, "BACKGROUND")), 200, 350, 60, 90, 0, 10).toHSLString();

    string[27] memory parts;
    parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"> <defs> <linearGradient id="l6-fill" x1="1024.03" y1="812.954" x2="1024.03" y2="1311.67" spreadMethod="pad" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 1 0 0)"> <stop id="l6-fill-0" offset="0%" stop-color="';
    parts[1] = c1;
    parts[2] = '"/> <stop id="l6-fill-1" offset="100%" stop-color="';
    parts[3] = c0;
    parts[4] = '"/> </linearGradient> <linearGradient id="l8-fill" x1="785.642" y1="238.446" x2="785.642" y2="1311.67" spreadMethod="pad" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 1 0 0)"> <stop id="l8-fill-0" offset="0%" stop-color="';
    parts[5] = c1;
    parts[6] = '"/> <stop id="l8-fill-1" offset="100%" stop-color="';
    parts[7] = c0;
    parts[8] = '"/> </linearGradient><linearGradient id="i0-fill" x1="1262.52" y1="238.446" x2="1262.52" y2="1311.71" spreadMethod="pad" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 1 0 0)"> <stop id="i0-fill-0" offset="0%" stop-color="';
    parts[9] = c1;
    parts[10] = '"/> <stop id="i0-fill-1" offset="100%" stop-color="';
    parts[11] = c0;
    parts[12] = '"/> </linearGradient> <linearGradient id="i3-fill" x1="785.642" y1="1120.27" x2="785.642" y2="1792.28" spreadMethod="pad" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 1 0 0)"> <stop id="i3-fill-0" offset="0%" stop-color="';
    parts[13] = c1;
    parts[14] = '"/> <stop id="i3-fill-1" offset="100%" stop-color="';
    parts[15] = c0;
    parts[16] = '"/> </linearGradient> <linearGradient id="i5-fill" x1="1262.72" y1="1120.29" x2="1262.72" y2="1792.29" spreadMethod="pad" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 1 0 0)"> <stop id="i5-fill-0" offset="0%" stop-color="';
    parts[17] = c1;
    parts[18] = '"/> <stop id="i5-fill-1" offset="100%" stop-color="';
    parts[19] = c0;
    parts[20] = '"/> </linearGradient> </defs> <rect id="l2" width="2048" height="2048" rx="0" ry="0" transform="matrix(1 0 0 1 1.6 0)" fill="';
    parts[21] = bg;
    parts[22] = '" stroke="none" stroke-width="1"/> <g id="l3"> <g id="l4"> <g id="l5" opacity="0.8"> <path id="l6" d="M1024.7,813L550.4,1029.9L1024.8,1311.7L1498.9,1029.9L1024.7,813Z" transform="matrix(0.9976 0 0 1 3.45916 -1)" fill="url(#l6-fill)" stroke="none" stroke-width="1"/>';
    parts[23] = '</g> </g> <g id="l7"> <path id="l8" d="M1024.7,243.8L1024.7,1309L551.3,1029.3L1024.7,243.8Z" transform="matrix(1 0 0 1 1 0)" opacity="0.5" fill="url(#l8-fill)" stroke="none" stroke-width="1"/> </g> <g id="l9">';
    parts[24] = '<path id="i0" d="M1025.6,1309.1L1025.6,243.8L1498.8,1029.3L1025.6,1309.1Z" opacity="0.8" fill="url(#i0-fill)" stroke="none" stroke-width="1"/> </g> <g id="i1"> <g id="i2" opacity="0.9">';
    parts[25] = '<path id="i3" d="M1024.7,1402.9L1024.7,1787.5L554.5,1125.1L1024.7,1402.9Z" transform="matrix(1 0 0 1 1 0)" opacity="0.45" fill="url(#i3-fill)" stroke="none" stroke-width="1"/> </g> <g id="i4" opacity="0.8">';
    parts[26] = '<path id="i5" d="M1496,1125.2L1025.6,1787.6L1025.6,1403L1496,1125.2Z" opacity="0.8" fill="url(#i5-fill)" stroke="none" stroke-width="1"/> </g> </g> </g> </svg>';

    string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9], parts[10]));
    output = string(abi.encodePacked(output, parts[11], parts[12], parts[13], parts[14], parts[15], parts[16], parts[17], parts[18], parts[19], parts[20]));
    output = string(abi.encodePacked(output, parts[21], parts[22], parts[23], parts[24], parts[25], parts[26]));

    output = Base64.encode(bytes(string(abi.encodePacked('{"name":"NFETH #', count, '","description":"', DESCRIPTION, '","image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
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
