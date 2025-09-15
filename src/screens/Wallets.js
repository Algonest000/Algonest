import React, { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import AlertPopup from "../components/AlertPopup";

// Background images
const bgSmall = './bg-small.jpg';
const bgMedium = './bg-medium.jpg';
const bgLarge = './bg-large.jpg';

// Network validation regex patterns
const VALIDATION_RULES = {
  'TON/USDT': /^(?:[a-zA-Z0-9_-]{48}|[a-zA-Z0-9_-]{95})$/,
  'TON/TON': /^(?:[a-zA-Z0-9_-]{48}|[a-zA-Z0-9_-]{95})$/,
  'TRX/USDT': /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
  'TRX/TRON': /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
  'SOL/USDT': /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  'SOL/SOLANA': /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
};

const NETWORK_INFO = {
  'TON': { name: 'The Open Network', example: 'EQ... or UQ... (48/95 chars)' },
  'TRX': { name: 'TRON Network', example: 'T... (34 chars starting with T)' },
  'SOL': { name: 'Solana Network', example: '... (32-44 base58 chars)' }
};

const coinOptions = [
  { value: 'TON/USDT', label: 'USDT (TON Network)' },
  { value: 'TON/TON', label: 'TON (TON Network)' },
  { value: 'TRX/USDT', label: 'USDT (TRON Network)' },
  { value: 'TRX/TRON', label: 'TRX (TRON Network)' },
  { value: 'SOL/USDT', label: 'USDT (Solana Network)' },
  { value: 'SOL/SOLANA', label: 'SOL (Solana Network)' }
];

const Wallets = () => {
  const [alert, setAlert] = useState(null);
  const [walletDetails, setWalletDetails] = useState(null);
  const [tempWalletDetails, setTempWalletDetails] = useState({
    coin_name: "",
    wallet_address: ""
  });
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);
  const [walletError, setWalletError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // Responsive background
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 640) setBackgroundImage(bgSmall);
      else if (width <= 1024) setBackgroundImage(bgMedium);
      else setBackgroundImage(bgLarge);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const jwtToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          " https://api.algonestdigitals.com/api/wallets.php",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        const data = await response.json();

        if (data.success) {
          // Get the first wallet (assuming only one is allowed)
          setWalletDetails(data.fiat_details[0] || null);
        } else {
          showAlert("error", data.error || "Failed to load wallet");
        }
      } catch (error) {
        showAlert("error", "Network error: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletDetails();
  }, [jwtToken]);

  const validateWalletAddress = (address, coinName) => {
    if (!address) {
      setWalletError("Wallet address is required");
      return false;
    }

    const regex = VALIDATION_RULES[coinName];
    if (!regex) {
      setWalletError("Invalid coin selection");
      return false;
    }

    if (!regex.test(address)) {
      const network = coinName.split('/')[0];
      setWalletError(`Invalid ${network} address. ${NETWORK_INFO[network]?.example || ''}`);
      return false;
    }

    setWalletError("");
    return true;
  };

  const handleWalletSubmit = async (e) => {
    e.preventDefault();
    if (!validateWalletAddress(tempWalletDetails.wallet_address, tempWalletDetails.coin_name)) return;

    try {
      setLoading(true);
      const response = await fetch(
        " https://api.algonestdigitals.com/api/wallets.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            type: "fiat",
            coin_name: tempWalletDetails.coin_name,
            wallet_address: tempWalletDetails.wallet_address,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setWalletDetails({
          coin_name: tempWalletDetails.coin_name,
          wallet_address: tempWalletDetails.wallet_address
        });
        setTempWalletDetails({ coin_name: "", wallet_address: "" });
        setEditing(false);
        showAlert("success", "Wallet updated successfully!");
      } else {
        throw new Error(data.error || "Failed to save wallet");
      }
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getNetworkName = (coinName) => {
    const network = coinName.split('/')[0];
    return NETWORK_INFO[network]?.name || network;
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center px-4 py-10 pb-20"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {alert && (
        <AlertPopup
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">Crypto Wallet</h1>

        {/* Network Notice */}
        <div className="bg-blue-900/45 p-4 rounded-lg border border-blue-700">
          <p className="text-sm text-blue-200">
            <strong>Note:</strong> Each network has specific address formats. Make sure to use the correct one.
          </p>
        </div>

        {/* Wallet Section */}
        <div className="z-{-999} bg-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-center">Your Wallet</h2>
          
          {loading && !walletDetails && !editing ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : editing ? (
            <form onSubmit={handleWalletSubmit}>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Select Coin/Network
                </label>
                <select
                  value={tempWalletDetails.coin_name}
                  onChange={(e) => {
                    setTempWalletDetails({
                      ...tempWalletDetails,
                      coin_name: e.target.value,
                      wallet_address: ""
                    });
                    setWalletError("");
                  }}
                  className="w-full p-3 bg-gray-700/80 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Select a coin</option>
                  {coinOptions.map((coin) => (
                    <option key={coin.value} value={coin.value}>
                      {coin.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  placeholder={
                    tempWalletDetails.coin_name 
                      ? `Enter ${tempWalletDetails.coin_name.split('/')[0]} address` 
                      : "Select coin first"
                  }
                  value={tempWalletDetails.wallet_address}
                  onChange={(e) => {
                    setTempWalletDetails({
                      ...tempWalletDetails,
                      wallet_address: e.target.value
                    });
                    if (tempWalletDetails.coin_name) {
                      validateWalletAddress(e.target.value, tempWalletDetails.coin_name);
                    }
                  }}
                  className={`w-full p-3 bg-gray-700/80 text-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    walletError ? "focus:ring-red-500 border-red-500" : "focus:ring-blue-500"
                  }`}
                  required
                  disabled={!tempWalletDetails.coin_name}
                />
                {walletError ? (
                  <p className="text-red-400 text-xs mt-1">{walletError}</p>
                ) : tempWalletDetails.coin_name ? (
                  <p className="text-gray-400 text-xs mt-1">
                    {NETWORK_INFO[tempWalletDetails.coin_name.split('/')[0]]?.example}
                  </p>
                ) : null}
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setTempWalletDetails({ coin_name: "", wallet_address: "" });
                  }}
                  className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!walletError || loading || !tempWalletDetails.coin_name}
                  className={`flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors ${
                    walletError || loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Wallet"
                  )}
                </button>
              </div>
            </form>
          ) : walletDetails ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Asset:</span>
                <span className="font-medium">{walletDetails.coin_name.split('/')[1]}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Network:</span>
                <span className="font-medium">{getNetworkName(walletDetails.coin_name)}</span>
              </div>
              
              <div>
                <span className="text-gray-400 block mb-1">Wallet Address:</span>
                <div className="bg-gray-700/80 p-3 rounded break-all">
                  {walletDetails.wallet_address}
                </div>
              </div>
              
              <button
                onClick={() => {
                  setTempWalletDetails({
                    coin_name: walletDetails.coin_name,
                    wallet_address: walletDetails.wallet_address
                  });
                  setEditing(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              >
                Edit Wallet Address
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-400 mb-4">No wallet address saved yet</p>
              <button
                onClick={() => setEditing(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
              >
                Add Wallet Address
              </button>
            </div>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Wallets;