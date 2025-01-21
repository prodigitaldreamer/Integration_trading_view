import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider, ConnectButton, useConnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { SwapWidget } from "@uniswap/widgets";
// import '@uniswap/widgets/fonts.css'
function App() {
  const client = createThirdwebClient({
    clientId: "0f98b18c49ef852480a5c66ce75ed315",
  });
  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
    createWallet("com.trustwallet.app"),
    createWallet("org.uniswap"),
    createWallet("com.bitget.web3"),
    createWallet("com.binance"),
    createWallet("com.okex.wallet"),
  ];
  return (
    <>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <ConnectButton
          onConnect={(wallet) => {}}
          client={client}
          wallets={wallets}
          connectModal={{ size: "compact" }}
        />
      </div>
      {/* <SwapWidget></SwapWidget> */}
    </>
  );
}

export default App;
