import { useEffect, useState, useRef } from "react";
import { utils } from "web3";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import cn from "classnames";
//import debounce from "debounce";
import { SelfBuildingSquareSpinner } from "react-epic-spinners";
import { Link } from "react-feather";
import Layout from "../components/Layout";
import Web3Provider from "../components/Web3Provider";
import { address as NFethAddress, abi as NFethABI } from "../src/nfteth";

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
const wcConnector = new WalletConnectConnector({
  infuraId: "cddde80366fc42c2ac9202c6a0f9850b",
});
const wrapAmount = "1.02";

export default function WrappedHome() {
  return (
    <Web3Provider>
      <Home />
    </Web3Provider>
  );
}

function Home() {
  const { activate, active, account, library } = useWeb3React();

  const [soldOut, setSoldOut] = useState(true);
  const [success, setSuccess] = useState(false);
  const [working, setWorking] = useState(true);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);
  const [totalMinted, setTotal] = useState(0);
  const [tokenId, settokenId] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const redeemField = useRef();

  useEffect(() => {
    if (!library) return;

    // library.eth.handleRevert = true // fails with TypeError: err.data.substring is not a function

    const contract = new library.eth.Contract(NFethABI, NFethAddress);
    setContract(contract);
    
    contract.methods
      .getSupply()
      .call()
      .then((res) => {
        setTotal(res);
        setSoldOut(res >= 10000);
      }, handleError);

    setWorking(false);
  }, [account]);

  function handleError(err) {
    console.error(err);
    setWorking(false);
    setSuccess(false);
    setError(err);
  }

  function mintForSelf() {
    setWorking(true);
    setError(null);

    contract.methods
      .mintForSelf()
      .send(
        { from: account, value: utils.toWei(wrapAmount, "ether") },
        (err, hsh) => {
          if (err) return handleError(err);
          setTransactionHash(hsh);
        }
      )
      .then(() => {
        setWorking(false);
        setSuccess(true);
      }, handleError);
  }

  function redeemForEth() {
    redeemField.current.focus();
    
    setWorking(true);
    setError(null);

    contract.methods
      .redeemForEth(tokenId)
      .send(
        { from: account, value: utils.toWei("0", "ether") },
        (err, hsh) => {
          if (err) return handleError(err);
          setTransactionHash(hsh);
        }
      )
      .then(() => {
        setWorking(false);
        setSuccess(true);
      }, handleError);
  }

  
  const times = Array.from(Array(1));
  return (
    <Layout>
    
      <div className="p-5 md:p-16">
        <header className="leading-normal">
          <h1 className="md:text-8xl font-black text-center">ETH IS ART 🎨</h1>
          <div className="h-8"></div>
          <h2 className="tracking-tight md:text-3xl max-w-5xl">
            Wrap 1 ETH into an NF-ETH - A randomly generated and fully onchain ETH artwork, always redeemable for 1 ETH. 
          </h2>
          
        </header>

        <div className="h-8"></div>
        
        <div className="md:flex">

          <div className="flex-0 w-full flex flex-col space-y-4 md:max-w-md">
            {!active && (
              <ConnectButtons setWorking={setWorking} activate={activate} />
            )}
            {active && (
              <div>
                <MintButton
                  disabled={working || soldOut}
                  onClick={mintForSelf}
                  className="rounded-full"
                >
                  Wrap 1 ETH
                </MintButton>

                
                <div className="text-sm space-y-2 leading-normal">
                  <p>
                    <strong>Wrapping cost is Ξ0.02</strong>{" "}
                  </p>
                  <p>
                    All NF-ETHs are randomly generated and equally rare. The result will be different for each NF-ETH
                    depending on the block time, token number and destination address.
                  </p>
                  <p>
                    {totalMinted}/10,000 NF-ETHs have been minted.
                  </p>

                  <progress className="w-full" max={10000} value={totalMinted} />
                  
                  <div className="flex flex-col">
                  <p>
                  <strong>Redeem NF-ETH for ETH</strong>
                  </p>
                  <p>
                    Input your NF-ETH token id to redeem it for ETH. <strong>Warning:</strong> This will destroy the NF-ETH forever.
                  </p>
                  <input
                    ref={redeemField}
                    className="input text-sm md:text-lg rounded-2xl rounded-b-none"
                    value={tokenId}
                    onChange={(event) => {
                      settokenId(event.target.value);
                    }}
                    disabled={working || soldOut}
                    placeholder={"Input token id (E.g. 3)"}
                  />
                  <MintButton
                    disabled={working || soldOut}
                    className="rounded-2xl rounded-t-none"
                    onClick={redeemForEth}
                  >
                    Redeem NF-ETH for ETH
                  </MintButton>
                </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 md:grid-cols-6">
        <img src="/last-0.svg" className="" />
        <img src="/last-1.svg" className="" />
        <img src="/last-2.svg" className="" />
        <img src="/last-3.svg" className="" />
        <img src="/last-4.svg" className="" />
        <img src="/last-5.svg" className="" />
        <img src="/last-6.svg" className="" />
        <img src="/last-7.svg" className="" />
        <img src="/last-14.svg" className="" />
        <img src="/last-15.svg" className="" />
        <img src="/last-10.svg" className="" />
        <img src="/last-12.svg" className="" />
      </div>

      <div className="p-4 md:p-16 space-y-4 md:space-y-16">
        <div className="space-y-4 md:space-y-8 font-light">
          <h2 className="md:text-8xl md:font-thin">Info</h2>
          <div>
            <H4>What is an <em>NF-ETH?</em></H4>
            <p>
              We all know ETH IS MONEY 💸... But now {" "}
            <span className="rainbow bg-clip-text text-transparent font-strong">
            <strong>ETH IS ART</strong>
            </span>{" "} 🎨 as well! 
            <br />
            <br />
            ETH IS ART allows you to wrap 1 ETH into a randomly generated, fully onchain, ETH artwork - a Non-fungible ETH. In short, you can make your Ether <span className="font-bold rainbow bg-clip-text text-transparent">
              rare and special
            </span>{""}! <br /> <br />
The NF-ETH can <strong><em>always</em></strong> be redeemed back to 1 ETH, but the artwork will in return be destroyed. Kind of like a digital piggy bank - to redeem the ETH you must break open the NF-ETH.

            </p>
            </div>
            <div>
            <H4>How do I wrap ETH into an NF-ETH?</H4>
            <p>
              By connecting with Ethereum wallet above, you will be able to mint an NF-ETH, using the "Wrap 1 ETH" button. You need to have at least 1 ETH + 0.02 ETH to cover wrapping fee + gas cost to wrap your ETH. After wrapping, your NF-ETH should show up in your account instantly.
            </p>
          </div>
          <div>
            <H4>How do I redeem my NF-ETH for ETH?</H4>
            <p>
              If you wish to redeem your NF-ETH for 1 ETH, you must connect with your Ethereum wallet above, and input the Token ID of your NF-ETH, and click "Redeem NF-ETH for ETH". You can find your Token ID by navigating to your account on Etherscan, or by viewing it on OpenSea.
            </p>
          </div>
          <div>
            <H4>Why wrap ETH into an NF-ETH?</H4>
            <p>
            Just like you can wrap ETH into WETH to give it the superpowers of an ERC20 token, you can now wrap your ETH into an <strong><em>ERC721 token</em></strong> - aka an NFT. Some have a personal attachment to their ETH, and now you will be able to display your beautiful, and now rare, ETH as art in galleries or bring it with you into the metaverse. Or integrate it into your next project. What you do with it is up to you.
            </p>
          </div>
          <div>
            <H4>
            Limited supply, equally rare and fully onchain
            </H4>
            <p>
            To keep the NF-ETHs <span className="font-bold rainbow bg-clip-text text-transparent">
              rare and special
            </span>{" "} there is a max supply of 10,000 NF-ETHs. All NF-ETHs are randomly generated from the same SVG template, seeded with random colors based on the time it was minted, and the destination address. There are no special traits, so each NF-ETH is equally rare and special. The SVG data is stored fully onchain, so your NF-ETH will live on forever.
            </p>
          </div>
          <div>
            <H4>Ultra Sound Art</H4>
            <p>
            The idea behind NF-ETH is to experiment with value backed NFTs that will gradually also decrease in supply. Because some NF-ETH owners might choose to redeem their tokens for the underlying 1 ETH, the amount of NF-ETHs in existence should decrease overtime. NF-ETH is Ultra Sound Art. 🦇🔊🎨
            </p>
          </div>
          <div>  
      
            <H4>Minting fee funding a public good</H4>
            <p>
            To avoid griefing from someone using flash loans to generate a lot of NF-ETHs, only to burn them again to reduce supply, there is a minting fee of 0.02 ETH. Half of the fee (0.01 ETH) goes to the creator (spoiler alert it‘s me), and the other half (0.01 ETH) goes to a public good. I have chosen <A href="https://etherscan.io/">Etherscan</A> (<A href="https://etherscan.io/address/0x71c7656ec7ab88b098defb751b7401b5f6d8976f">see donation address here</A>) as the recipient of the other half of the fee, as they provide critical infrastructure for the entire Ethereum Community. You can therefore feel very good about minting an NF-ETH. Give yourself a pat on the back.
            </p>
          </div>
          <div>
            <H4>Inspired by Cranes</H4>
            <p>
            The contract code and frontend are inspired by <A href="http://cranes.supply/">Cranes</A> - another great project that you should definitely check out.
            </p>
          </div>
          <div>
            <H4>Security</H4>
            <p>
            The contract code is very simple and utilizes mostly standard secure contracts by OpenZeppelin. The code has been externally reviewed, and thoroughly tested. There are no admin functions and the contract cannot be upgraded, so what you see is what you get. The code is fully <A href="https://github.com/ethisart/ethisart/blob/main/contracts/NFETH.sol">open source for your verification</A>. <A href="https://github.com/ethisart/ethisart#disclaimer">See this disclaimer</A> and use at your own discretion.
            </p>
          </div>
          <div>
            <H4>Licensing</H4>
            <p>
            The ETH IS ART 🎨 website, contract code and NF-ETH assets are all <strong>Public Domain</strong> and can be used in any way you wish.
            </p>
          </div>
        </div>
      </div>
      <div className="text-sm p-5 md:p-16 leading-normal mb-8 text-center">
        <A href="#">
          Etherscan
        </A>{" "}
        &bull;{" "}
        <A href="#">
          OpenSea
        </A>{" "}
        &bull;{" "}<A href="https://twitter.com/ETH_IS_ART">Twitter</A>{" "}
        &bull;{" "}
        
        <A href="https://github.com/ethisart/ethisart/">GitHub</A>{" "}
        &bull;{" "}
        <A href="https://github.com/ethisart/ethisart#disclaimer">Disclaimer</A>
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-white dark:bg-gray-800 shadow-2xl border-t-2 border-gray-100 py-3 px-5">
        {error && (
          <div className="text-red-500 text-xs md:text-base mb-1">
            There was an error with your transaction. See Etherscan for details.
          </div>
        )}
        {!active && (
          <ConnectButtons setWorking={setWorking} activate={activate} />
        )}
        {active && (
          <div className="h-6 space-x-2 flex items-center">
            <span className="flex-1 block text-xs truncate md:text-base">
              Connected as <code className="text-red-500">{account}</code>
            </span>
            {transactionHash && (
              <a
                href={`https://etherscan.io/tx/${transactionHash}`}
                className={cn(
                  "btn flex space-x-1 text-xs px-3 font-normal bg-gray-200 rounded-full",
                  success ? "text-green-500" : "text-black",
                  error ? "text-red-500" : "text-black"
                )}
              >
                <Link className="h-3 w-3" />
                <span className="md:hidden">txn</span>
                <span className="hidden md:inline">
                  Transaction on Etherscan
                </span>
              </a>
            )}
            {working && (
              <div className="flex-0">
                <SelfBuildingSquareSpinner size={16} color="currentColor" />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

const A = (props) => <a className="text-blue-500 underline" {...props} />;
const H4 = (props) => <h4 className="font-bold" {...props} />;

function ConnectButtons({ activate, setWorking }) {
  const cls =
    "btn bg-white dark:bg-gray-900 rounded-full inline-flex images-center space-x-2 shadow-md border w-100 md:w-auto px-2 py-1 text-xs md:text-base font-normal";
  return (
    <>
      <div className="flex md:flex-row space-x-2">
        <button
          onClick={() => {
            setWorking(true);
            activate(injected);
          }}
          className={cn(cls, "text-yellow-600 border-yellow-600")}
        >
          <img src="/metamask-fox.svg" className="h-5 w-5" />
          <span>Metamask</span>
        </button>
        <button
          onClick={() => {
            setWorking(true);
            activate(wcConnector);
          }}
          className={cn(cls, "text-blue-500 border-blue-600")}
        >
          <img src="/walletconnect-logo.svg" className="h-5 w-5" />
          <span>WalletConnect</span>
        </button>
      </div>
    </>
  );
}

function MintButton({ className, ...props }) {
  return (
    <button
      className={cn(
        "btn md:text-lg text-sm tracking-tight bg-black dark:bg-white dark:text-black shadow-md font-light text-white",
        className
      )}
      {...props}
    />
  );
}