import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../wallet/WalletDashboard.css"; // Import the CSS file for styling
import { Sparklines, SparklinesLine } from "react-sparklines"; // Import Sparklines for the graphs
import Login from "./Login"; // Import the Login component
import SignupModal from "./SignupModal"; // Import the SignupModal component
import logo3 from "./logo3.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function TradePage() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true";
  const [info, setInfo] = useState([]);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const [showLoginModal, setShowLoginModal] = useState(false); // State to manage login modal visibility
  const [showSignupModal, setShowSignupModal] = useState(false); // State to manage signup modal visibility
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const uid = localStorage.getItem("userId");
  // const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status

  useEffect(() => {
    axios.get(url).then((response) => {
      setInfo(response.data.filter((crypto) => crypto.symbol !== "usdt")); // Filter out USDT
    });

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getGraphIndicator = (sparkline, priceChange) => {
    const color = priceChange >= 0 ? "green" : "red";
    return (
      <Sparklines data={sparkline} svgWidth={100} svgHeight={30}>
        <SparklinesLine color={color} />
      </Sparklines>
    );
  };

  if (info.length === 0) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="container">
        <header style={{ backgroundColor: "#4caf50" }}>
          <div
            className="title-container"
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            <h1>
              <Link to="/">TrustCoinFX</Link>
            </h1>

            <button className="menu-button" onClick={toggleMenu}>
              &#9776;
            </button>
          </div>
        </header>

        <div
          id="sidebar"
          className={`sidebar ${isMenuOpen ? "open" : ""}`}
          ref={sidebarRef}
        >
          <div className="sidebar-header">
            <img src={logo3} alt="logo" />
            <p>
              <b>UID: {uid}</b>
            </p>
          </div>

          <div className="functions">
            <ul>
              <li>
                <Link to="/wallet" className="link">
                  <i className="fas fa-wallet"></i> Wallet
                </Link>
              </li>
              <li>
                <Link to="/tradepage">
                  <i className="fas fa-exchange-alt"></i> Trade
                </Link>
              </li>
              <li>
                <Link to="/result">
                  <i className="fas fa-chart-line"></i> Result
                </Link>
              </li>
              <li>
                <Link to="/transaction">
                  <i className="fas fa-pen"></i> Transactions
                </Link>
              </li>
              <li>
                <Link to="/terms">
                  <i className="fas fa-book"></i> Privacy Policy
                </Link>
              </li>
            </ul>

            <div className="more-options">
              <ul>
                {isLoggedIn ? (
                  <li>
                    <Link to="/settings">
                      <i className="fa-solid fa-gear"></i> Settings
                    </Link>
                  </li>
                ) : (
                  <li>
                    <button onClick={() => setShowLoginModal(true)}>
                      <i className="fa-solid fa-person"></i> Login
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="banner">
            <h2>Discover Seamless Crypto Trading</h2>
            <h2>With TrustCoinFX</h2>
            <p>Where Trust is Our Currency</p>
          </div>
          <div className="market-tabs">
            <button className="active">Digital Currency</button>
          </div>
          <div className="market-list">
            {info.map((value, key) => {
              if (key < 20) {
                return (
                  <div
                    key={key}
                    className="market-item"
                    onClick={() => navigate("/predict", { state: { value } })}
                  >
                    <div className="market-info" style={{ display: "flex" }}>
                      <img
                        src={value.image}
                        alt={`${value.symbol} logo`}
                        style={{
                          width: "24px",
                          height: "24px",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <h3>{value.symbol.toUpperCase()} Coin</h3>
                        <p>USDT</p>
                      </div>
                    </div>
                    <div className="market-graph">
                      {getGraphIndicator(
                        value.sparkline_in_7d.price,
                        value.price_change_percentage_24h
                      )}
                    </div>
                    <div className="market-stats">
                      <p>US$ {value.current_price.toFixed(2)}</p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          textAlign: "center",
                          alignItems: "center",
                        }}
                      >
                        <p
                          className={
                            value.price_change_percentage_24h < 0
                              ? "negative"
                              : "positive"
                          }
                          style={{ fontSize: "13px", marginRight: "10px" }}
                        >
                          {value.price_change_percentage_24h.toFixed(2)}%
                        </p>
                        <p>24 Hrs</p>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>

        {showCryptoModal && selectedCrypto && (
          <div className="modal" id="crypto-modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowCryptoModal(false)}>
                &times;
              </span>
              <div className="wallet">
                <div className="wallet-header">
                  <h1>{selectedCrypto.name} Wallet</h1>
                </div>
                <div className="wallet-balance">
                  <p>${selectedCrypto.current_price}</p>
                  <p>
                    Available: {selectedCrypto.circulating_supply}{" "}
                    {selectedCrypto.symbol.toUpperCase()}
                  </p>
                  <p>High 24h: ${selectedCrypto.high_24h}</p>
                  <p>Low 24h: ${selectedCrypto.low_24h}</p>
                </div>
                <div className="wallet-qr">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${selectedCrypto.symbol}Address&size=150x150`}
                      alt="QR Code"
                    />
                  </div>
                  <p id="btc-address">3ghadsb893p2lsand</p>
                  <p
                    className="copy-address"
                    onClick={() =>
                      navigator.clipboard.writeText("3ghadsb893p2lsand")
                    }
                  >
                    Copy address
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showLoginModal && (
          <Login closeModal={() => setShowLoginModal(false)} />
        )}

        {showSignupModal && (
          <SignupModal closeModal={() => setShowSignupModal(false)} />
        )}
      </div>
    );
  }
}
