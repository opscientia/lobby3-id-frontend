import React from "react";
// import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { desiredChainId } from "./constants/desiredChain";
import { WagmiConfig, createClient, configureChains, chain } from "wagmi";
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";

// Set up wagmi connectors
// const client = createClient({
//   autoConnect: true,
//   connectors({ chainId }) {
//     return [
//       // new InjectedConnector({
//       //   options: {
//       //     chainId: desiredChainId,
//       //   },
//       // }),

//       new MetaMaskConnector({}),
      
//       new CoinbaseWalletConnector({
//         options: {
//           appName: 'holonym',
//         },
//       }),

//       new WalletConnectConnector({
//         options: {
//           qrcode: true,
//         },
//       }),
//     ];
//   },
// });

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon],
  [publicProvider()],
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <WagmiConfig client={client}>
    <App />
  </WagmiConfig>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
