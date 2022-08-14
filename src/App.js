import "./App.css";
import "./holo-wtf.webflow.css";
import "./normalize.css";
import "./webflow.css";
import { HomeLogo } from "./components/logo.js";
import React, { useEffect, useState } from "react";
import WebFont from "webfontloader";
import Address from "./components/atoms/Address.js";
import WalletModal from "./components/atoms/WalletModal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useConnect, useAccount, useNetwork } from "wagmi";
// import { desiredChain } from "./constants/desiredChain";
import {
  ChainSwitcher,
  ChainSwitcherModal,
  useDesiredChain,
} from "./components/chain-switcher";
import Error from "./components/errors.js";
import VerificationButton from "./components/atoms/VerificationButton";
import Verified from "./components/Verified";

function App() {
  const { desiredChain, setDesiredChain } = useDesiredChain();
  const { data: account } = useAccount();
  const [walletModalShowing, setWalletModalShowing] = useState(false);
  useEffect(() => {
    WebFont.load({
      google: {
        families: [
          "Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic",
        ],
      },
    });
  }, []);

  return (
    <div className="App x-section wf-section bg-img">
      <div className="x-container nav w-container">
        <WalletModal
          visible={walletModalShowing}
          setVisible={setWalletModalShowing}
          blur={true}
        />
        <HomeLogo />

        {account?.address && account?.connector ? (
          <Address address={account.address} />
        ) : (
          <div className="nav-btn">
            <div
              className="wallet-connected nav-button"
              // disabled={!connectors[0].ready}
              // key={connectors[0].id}
              onClick={() => setWalletModalShowing(true)}
            >
              <div style={{ opacity: 0.5 }}>Connect Wallet</div>
            </div>
          </div>
        )}
        <Router>
          <Routes>
            <Route path={"/"} element={<VerificationButton />} />
            <Route path={"/verified"} element={<Verified />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
