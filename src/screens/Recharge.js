import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import AlertPopup from "../components/AlertPopup";
import BottomNav from "../components/BottomNav";

// Background images for different screen sizes
const bgSmall = './bg-small.jpg';
const bgMedium = './bg-medium.jpg';
const bgLarge = './bg-large.jpg';

const CombinedRecharge = () => {
  const [currentPage, setCurrentPage] = useState("info");
  const [method, setMethod] = useState("fiat");
  const [amount, setAmount] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [proof, setProof] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [alert, setAlert] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [fiatDetails, setFiatDetails] = useState(null);
  const [copied, setCopied] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("authToken");

  // Responsive background setup
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 640) setBackgroundImage(bgSmall);
      else if (width <= 1024) setBackgroundImage(bgMedium);
      else setBackgroundImage(bgLarge);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!jwtToken) {
      showAlert("error", "You are not logged in.");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [jwtToken, navigate]);

  const fetchWalletDetails = async () => {
    try {
      const response = await fetch(
        "https://api.algonestdigitals.com/AlgonestDigitals/public/wallets.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setBankDetails(data.bank_details[0] || null);
        setFiatDetails(data.fiat_details[0] || null);
      } else {
        showAlert("error", data.error);
      }
    } catch (error) {
      showAlert("error", "Error fetching wallet details: " + error.message);
    }
  };

  useEffect(() => {
    if (jwtToken) {
      fetchWalletDetails();
    }
  }, [jwtToken]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setProof(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleProceed = () => {
    setCurrentPage("recharge");
  };

  const handleBack = () => {
    setCurrentPage("info");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!jwtToken) {
      showAlert("error", "Authorization token is missing.");
      setIsSubmitting(false);
      return;
    }
  
    if (!proof) {
      showAlert("warning", "Please upload a proof of payment.");
      setIsSubmitting(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("payment_method", method);
    formData.append("narration", referenceId);
    formData.append("proof", proof);
  
    try {
      const response = await fetch("https://api.algonestdigitals.com/AlgonestDigitals/public/invest", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (data.success) {
        showAlert("success", data.message);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        showAlert("error", data.error || "Deposit failed.");
      }
    } catch (error) {
      showAlert("error", "Error submitting deposit: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const adminDetails = {
    fiat: {
      walletAddress: "TUdb2PtkoDAKFiSZExwgG6i2gAX1Lz2hf7",
      network: "Tether usdt tronx network",
      walletAddress1: "HSoycY7wwXo2Y6ZfaWp4hriDgASUWCgGroGMmBZBKtBq",
      network1: "Tether usdt solana network", 
      walletAddress2: "UQCURJpI9cYd_0dm9Bbgwqjt19aSR08uWMv0Um5sILCLtdxu",
      network2: "Tether usdt ton network",
    },
    bank: {
      accountNumber: "9876543210",
      bankName: "Admin Bank",
      accountName: "Admin Doe",
    },
  };

  if (currentPage === "info") {
    return (
      <div 
        className="min-h-screen text-white pb-20"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {alert && (
          <AlertPopup
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        
        <div className="max-w-lg mx-auto p-4">
          <div className="flex items-center mb-6">
            <Link to="/dashboard" className="text-gray-400 hover:text-white mr-3 transition-colors">
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </Link>
            <h1 className="text-xl font-bold">Deposit Instructions</h1>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Deposit Tips</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2"></span>
                <span>Make deposits strictly to the provided details.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2"></span>
                <span>Take a screenshot of the transaction as proof.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2"></span>
                <span>Make sure you send your coin using the correct network to avoid loss of funds.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2"></span>
                <span>When attaching your withdrawal wallet, make sure you select the correct network.</span>
              </li>
            </ul>
          </div>

        <div className="bg-gray-800 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700 p-6 mb-6">
  <h3 className="text-lg font-semibold mb-4 text-blue-400">Crypto Deposit Details</h3>
  <div className="space-y-4">
    {/* First Wallet */}
    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400">Wallet Address (USDT/TRON):</span>
        <button 
          onClick={(e) => copyToClipboard(adminDetails.fiat.walletAddress)}
          className="text-blue-400 hover:text-blue-300"
        >
          {copied ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faCopy} />}
        </button>
      </div>
      <p className="font-mono break-all">{adminDetails.fiat.walletAddress}</p>
      <p className="text-gray-400 text-sm mt-1">{adminDetails.fiat.network}</p>
    </div>
    
    {/* Second Wallet */}
    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400">Wallet Address (USDT/SOL):</span>
        <button 
          onClick={(e) => copyToClipboard(adminDetails.fiat.walletAddress1)}
          className="text-blue-400 hover:text-blue-300"
        >
          {copied ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faCopy} />}
        </button>
      </div>
      <p className="font-mono break-all">{adminDetails.fiat.walletAddress1}</p>
      <p className="text-gray-400 text-sm mt-1">{adminDetails.fiat.network1}</p>
    </div>
    
    {/* Third Wallet */}
    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400">Wallet Address (USDT/TON):</span>
        <button 
          onClick={(e) => copyToClipboard(adminDetails.fiat.walletAddress2)}
          className="text-blue-400 hover:text-blue-300"
        >
          {copied ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faCopy} />}
        </button>
      </div>
      <p className="font-mono break-all">{adminDetails.fiat.walletAddress2}</p>
      <p className="text-gray-400 text-sm mt-1">{adminDetails.fiat.network2}</p>
    </div>
  </div>
</div>

          <button
            onClick={handleProceed}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg transition-all duration-300"
          >
            I Have Completed the Transaction
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white pb-20"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {alert && (
        <AlertPopup
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="max-w-lg mx-auto p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/90 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700 p-6"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Submit Deposit Proof</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Amount ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Transaction ID</label>
              <input
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="Enter transaction reference"
                className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Payment Proof (Screenshot)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                required
              />
              {proofPreview && (
                <div className="mt-4">
                  <img
                    src={proofPreview}
                    alt="Proof Preview"
                    className="w-full h-auto rounded-lg border border-gray-600"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Payment Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
              >
                <option value="fiat">Crypto Payment</option>
                <option disabled value="bank_transfer">Bank Transfer (Not Available)</option>
              </select>
            </div>

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="submit"
                className={`flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-900'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Submit Proof'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};

export default CombinedRecharge;