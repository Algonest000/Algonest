import React, { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowDown, 
  faArrowUp, 
  faSpinner, 
  faCircleCheck, 
  faClock, 
  faTimesCircle,
  faHourglassHalf
} from "@fortawesome/free-solid-svg-icons";

// Background images for different screen sizes
const bgSmall = './bg-small.jpg';
const bgMedium = './bg-medium.jpg';
const bgLarge = './bg-large.jpg';
const bgXLarge = './bg-xlarge.jpg';

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("deposit");
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);

  // Status color mapping
const statusColors = {
  approved: {
    bg: 'bg-green-900/30',
    text: 'text-green-400',
    icon: faCircleCheck,
    iconColor: 'text-green-400',
  },
  pending: {
    bg: 'bg-yellow-900/30',
    text: 'text-yellow-400',
    icon: faClock,
    iconColor: 'text-yellow-400',
  },
  rejected: {
    bg: 'bg-red-900/30',
    text: 'text-red-400',
    icon: faTimesCircle,
    iconColor: 'text-red-400',
  },
  default: {
    bg: 'bg-gray-700/30',
    text: 'text-gray-400',
    icon: faClock,
    iconColor: 'text-gray-400',
  },
};

  // Responsive background setup
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width <= 640) setBackgroundImage(bgSmall);
      else if (width <= 1024) setBackgroundImage(bgMedium);
      else if (width >= 2560 && height >= 1440) setBackgroundImage(bgXLarge);
      else setBackgroundImage(bgLarge);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("User not authenticated.");

        const response = await fetch(" https://api.algonestdigitals.com/api/transactions.php", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch transactions.");
        }

        const data = await response.json();
        setDeposits(data.transactions.deposits || []);
        setWithdrawals(data.transactions.withdrawals || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusConfig = (status) => {
    const normalizedStatus = status.toLowerCase();
    return statusColors[normalizedStatus] || statusColors.default;
  };

  const formatDate = (timestamp) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(timestamp).toLocaleDateString(undefined, options);
  };

  return (
    <div 
      className="text-white min-h-screen p-4 pb-20"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-center text-2xl font-bold mb-6">Transaction History</h1>

        {/* Tab Section */}
        <div className="flex justify-center mb-6 bg-gray-800 rounded-full p-1 backdrop-blur-sm">
          <button
            className={`flex items-center justify-center px-6 py-2 rounded-full transition-all ${
              activeTab === "deposit"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("deposit")}
          >
            <FontAwesomeIcon icon={faArrowDown} className="mr-2" />
            Deposits
          </button>
          <button
            className={`flex items-center justify-center px-6 py-2 rounded-full transition-all ${
              activeTab === "withdraw"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("withdraw")}
          >
            <FontAwesomeIcon icon={faArrowUp} className="mr-2" />
            Withdrawals
          </button>
        </div>

        {/* Loading or Error */}
        {loading ? (
          <div className="text-center py-10">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="animate-spin text-4xl text-blue-500 mb-4" 
            />
            <p className="text-gray-300">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 p-4 rounded-lg text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Tab Content */}
            {activeTab === "deposit" && (
              <div className="bg-gray-800 rounded-xl p-4 backdrop-blur-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <FontAwesomeIcon icon={faArrowDown} className="text-blue-400 mr-2" />
                  Deposit History
                </h2>
                {deposits.length > 0 ? (
                  <div className="space-y-3">
                    {deposits.map((deposit, index) => {
                      const statusConfig = getStatusConfig(deposit.status);
                      return (
                        <div
                          key={index}
                          className={`${statusConfig.bg} p-4 rounded-lg hover:bg-opacity-50 transition-colors border-l-4 ${statusConfig.text.replace('text-', 'border-')}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">$ {deposit.amount}</p>
                              <p className="text-sm text-gray-400">{formatDate(deposit.timestamp)}</p>
                            </div>
                            <div className={`flex items-center ${statusConfig.text}`}>
                              <FontAwesomeIcon 
                                icon={statusConfig.icon} 
                                className={`mr-2 ${statusConfig.iconColor}`} 
                              />
                              <span className="capitalize">{deposit.status}</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-600/50 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-400">Transaction ID</p>
                              <p className="truncate">{deposit.transaction_id}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Method</p>
                              <p className="capitalize">{deposit.payment_method}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    No deposit transactions found
                  </div>
                )}
              </div>
            )}

            {activeTab === "withdraw" && (
              <div className="bg-gray-800 rounded-xl p-4 backdrop-blur-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  <FontAwesomeIcon icon={faArrowUp} className="text-green-400 mr-2" />
                  Withdrawal History
                </h2>
                {withdrawals.length > 0 ? (
                  <div className="space-y-3">
                    {withdrawals.map((withdrawal, index) => {
                      const statusConfig = getStatusConfig(withdrawal.status);
                      return (
                        <div
                          key={index}
                          className={`${statusConfig.bg} p-4 rounded-lg hover:bg-opacity-50 transition-colors border-l-4 ${statusConfig.text.replace('text-', 'border-')}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">$ {withdrawal.amount}</p>
                              <p className="text-sm text-gray-400">{formatDate(withdrawal.timestamp)}</p>
                            </div>
                            <div className={`flex items-center ${statusConfig.text}`}>
                              <FontAwesomeIcon 
                                icon={statusConfig.icon} 
                                className={`mr-2 ${statusConfig.iconColor}`} 
                              />
                              <span className="capitalize">{withdrawal.status}</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-600/50 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-400">Transaction ID</p>
                              <p className="truncate">{withdrawal.transaction_id}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Method</p>
                              <p className="capitalize">{withdrawal.payment_method}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    No withdrawal transactions found
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Transactions;