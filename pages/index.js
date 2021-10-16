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
import { address as nfethAddress, abi as nfethABI } from "../src/nfteth";

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
const wcConnector = new WalletConnectConnector({
  infuraId: "cddde80366fc42c2ac9202c6a0f9850b",
});

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

    const contract = new library.eth.Contract(nfethABI, nfethAddress);
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
        { from: account, value: utils.toWei("0.0012", "ether") }, //TODO SET TO 1.02 ETH
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
            Wrap your ETH into an NFeth: A randomly generated fully onchain masterpiece, redeemable for ETH. 
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
                  Wrap NFeth
                </MintButton>

                
                <div className="text-sm space-y-2 leading-normal">
                  <p>
                    <strong>Wrapping cost is Ξ0.02</strong>{" "}
                  </p>
                  <p>
                    All NFeths are randomly generated and equally rare. The result will be different for each NFeth
                    depending on its number and destination address.
                  </p>
                  <p>
                    {totalMinted}/10,000 NFeths have been minted.
                  </p>

                  <progress className="w-full" max={10000} value={totalMinted} />
                  
                  <div className="flex flex-col">
                  <p>
                  <strong>Redeem NFeth for ETH</strong>
                  </p>
                  <p>
                    Input your NFeth token id to redeem it for ETH. (Warning: This will destroy the NFeth forever)
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
                    Redeem NFeth for ETH
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

      <div className="p-5 md:p-16 space-y-4 md:space-y-16">
        <div className="space-y-4 md:space-y-8 font-light">
          <h2 className="md:text-8xl md:font-thin">FAQ</h2>
          <div>
            <H4>What is an <em>NFeth?</em></H4>
            <p>
              We all know ETH IS MONEY 💸... But now {" "}
            <span className="rainbow bg-clip-text text-transparent font-strong">
              ETH IS ART
            </span>{" "} 🎨 as well! 
            <br />
            <br />
            ETH IS ART allows you to wrap 1 ETH into a randomly generated, fully onchain, artwork - a Non-fungible ETH. In short, you can make your Ether <strong>RARE and FANCY!</strong> <br /> <br />
The NFeth can <strong><u>always</u></strong> be redeemed back to 1 ETH, but the artwork will in return be destroyed. Kind of like a digital piggy bank - to redeem the ETH you must break open the NFeth.

            </p>
            </div>
          <div>
            <H4>Why wrap ETH into an NFeth?</H4>
            <p>
            Just like you can wrap ETH into WETH to give it the superpowers of an ERC20 token, you can now wrap your ETH into an <u>ERC721 token</u> - aka an NFT. This means being able to display your beautiful, and now rare, ETH as art in galleries or in the metaverse. Or integrate it into your next project. What you do with it is up to you.
            </p>
          </div>
          <div>
            <H4>
            Limited Supply, Equally Rare and Fully Onchain?
            </H4>
            <p>
            To keep the NFeths <span className="rainbow bg-clip-text text-transparent font-bold">
              rare and special
            </span>{" "} there is a max supply of 10,000 NFeths. All NFeths are randomly generated from the same SVG template, seeded with random colors based on the time it was minted, and the destination address. There are no special traits, so each NFeth is equally rare and special. The SVG data is stored fully onchain, so your NFeth will live on forever.
            </p>
          </div>
          <div>
            <H4>Ultra Sound Art</H4>
            <p>
            The idea behind NFeth is to experiment with value backed NFTs that will gradually also decrease in supply. Because some NFeth owners might choose to redeem their tokens for the underlying 1 ETH, there should be less and less NFeths in circulation. ETH is Ultra Sound Art. 🦇🔊🎨
            </p>
          </div>
          <div>  
      
            <H4>Funding a public good</H4>
            <p>
            To avoid griefing from someone using flash loans to generate a lot of NFeths, only to burn them again to reduce supply, there is a minting fee of 0.02 ETH. Half of the fee (0.01 ETH) goes to the creator (spoiler alert it‘s me), and the other half (0.01 ETH) goes to a public good. I have chosen <A href="https://etherscan.io/">Etherscan</A> as the recipient of the other half of the fee, as they provide critical infrastructure for the entire Ethereum Community. You can therefore feel very good about minting an NFeth. Give yourself a pat on the back.
            </p>
          </div>
          <div>
            <H4>Inspired by Cranes</H4>
            <p>
            The contract code and frontend are inspired by <A href="http://cranes.supply/">Cranes</A> - another great project that you should definitely check out.
            </p>
          </div>
          <div>
            <H4>Licensing</H4>
            <p>
            ETH IS ART 🎨 is public domain and can be used in any way you wish.
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
        &bull; <A href="">GitHub</A> &bull;{" "}
        <A href="#">Twitter</A>
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