import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import AlertPopup from "../components/AlertPopup";
import BottomNav from "../components/BottomNav";

// Background images for different screen sizes
const bgSmall = './bg-small.jpg';
const bgMedium = './bg-medium.jpg';
const bgLarge = './bg-large.jpg';

const Withdraw = () => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("fiat");
  const [successMsg, setSuccessMsg] = useState("");
  const [alert, setAlert] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);
  const [totalAssets, setTotalAssets] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const withdrawalFee = 0.1; // 10%
  const minWithdrawal = 3; // $5 minimum

  // Fetch account balance on component mount
  useEffect(() => {
    const fetchAccountBalance = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(" https://api.algonestdigitals.com/api/withdrawal.php", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setTotalAssets(data.balance);
        } else {
          showAlert("error", data.error || "Failed to fetch account balance");
        }
      } catch (error) {
        showAlert("error", "Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountBalance();
  }, []);

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

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const calculateActualArrival = () => {
    if (withdrawAmount && withdrawAmount >= minWithdrawal) {
      return (withdrawAmount * (1 - withdrawalFee)).toFixed(2);
    }
    return "0.00";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (withdrawAmount < minWithdrawal) {
      showAlert("warning", `The minimum withdrawal amount is $${minWithdrawal}.`);
      return;
    }

    if (withdrawAmount > totalAssets) {
      showAlert("error", `Insufficient balance. Your available balance is $${totalAssets.toFixed(2)}`);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("https://api.algonestdigitals.com/AlgonestDigitals/public/withdrawal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: withdrawAmount,
          payment_method: paymentMethod,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMsg("Withdrawal request submitted successfully!");
        showAlert("success", successMsg);
        setWithdrawAmount("");
        // Update the balance after successful withdrawal
        setTotalAssets(prev => prev - withdrawAmount);
      } else {
        showAlert("error", data.error || "Failed to process withdrawal");
      }
    } catch (error) {
      showAlert("error", "Network error. Please try again.");
    }
  };

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

      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link 
            to="/dashboard" 
            className="text-gray-400 hover:text-white mr-3 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </Link>
          <h1 className="text-xl font-bold">Withdraw Funds</h1>
        </div>

        {/* Withdrawal Card */}
        <div className="bg-gray-800 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700 p-6 mb-6">
          {/* Balance Summary */}
          <div className="bg-gray-700 p-4 rounded-lg mb-6 border border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Available Balance:</span>
              {isLoading ? (
                <div className="animate-pulse h-6 w-20 bg-gray-600 rounded"></div>
              ) : (
                <span className="text-xl font-bold">${totalAssets.toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Withdrawal Calculator */}
          <div className="bg-gray-700 p-4 rounded-lg mb-6 border border-gray-600">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300">You receive ($):</span>
              <span className="font-bold text-green-400">${calculateActualArrival()}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300">Withdrawal tax:</span>
              <span className="font-bold">{withdrawalFee * 100}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Minimum withdrawal amount ($):</span>
              <span className="font-bold">${minWithdrawal}</span>
            </div>
          </div>

          {/* Withdrawal Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Enter withdraw amount ($)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="0.00"
                className={`w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 ${
                  withdrawAmount < minWithdrawal && withdrawAmount !== ""
                    ? "focus:ring-red-500 border-red-500"
                    : "focus:ring-blue-500 border-gray-600"
                } border`}
                required
                min={minWithdrawal}
                step="0.01"
              />
              {withdrawAmount < minWithdrawal && withdrawAmount !== "" && (
                <p className="text-red-400 text-sm mt-1">
                  Minimum withdrawal is ${minWithdrawal}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
              >
                <option value="fiat">Crypto</option>
                <option disabled>Bank Transfer (Coming Soon)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={withdrawAmount < minWithdrawal || isLoading}
              className={`w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg transition-all duration-300 ${
                withdrawAmount < minWithdrawal || isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Processing..." : "Withdraw"}
            </button>
          </form>
        </div>

        {/* Withdrawal Tips */}
        <div className="bg-gray-800 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold">Withdrawal Tips</h3>
          </div>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2"></span>
              <span>Minimum withdrawal amount is ${minWithdrawal}.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2"></span>
              <span>Withdrawal fee: {withdrawalFee * 100}%.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2"></span>
              <span>Daily withdrawal time is from 10:00 AM to 5:00 PM.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2"></span>
              <span>The withdrawal credit time is generally within 10 minutes, and the maximum time does not exceed 24 hours.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2"></span>
              <span>You must invest in any product to activate the withdrawal function.</span>
            </li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Withdraw;