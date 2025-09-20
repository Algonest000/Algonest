import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GraphSection from "../components/GraphSection";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowRight, 
  faRobot, 
  faUserFriends, 
  faMoneyBillWave, 
  faWallet,
  faBullhorn,
  faHeadset,
  faCoins
} from "@fortawesome/free-solid-svg-icons";
import { 
  faWhatsapp,
  faTelegram
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import Preloader from "../components/Preloader";
import ErrorToast from "../components/ErrorToast";

// Background images for different screen sizes
const bgSmall = './bg.png';
const bgMedium = './bg.png';
const bgLarge = './bg.png';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);
  const navigate = useNavigate();

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

  const authToken = localStorage.getItem("authToken");
  const API_URL = "https://api.algonestdigitals.com/AlgonestDigitals/public/dashboard";

  const handleAuthError = () => {
    localStorage.removeItem("authToken");
    navigate("/login", { state: { from: "dashboard" }, replace: true });
  };

  const fetchDashboardData = async () => {
    try {
      if (!authToken) {
        handleAuthError();
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
        timeout: 10000, // 10 seconds timeout
      });

      if (response.data?.success) {
        setDashboardData(response.data.data);
      } else {
        throw new Error(response.data?.error || "Invalid server response");
      }
    } catch (error) {
      const errorMessage = 
        error.response?.status === 401 || 
        error.message.includes("Unauthorized") ||
        error.message.includes("invalid token")
          ? "Session expired. Please login again."
          : error.response?.data?.error || 
            error.message || 
            "Failed to fetch dashboard data";

      setError(errorMessage);

      if (error.response?.status === 401 || 
          error.message.includes("Unauthorized") ||
          error.message.includes("invalid token")) {
        handleAuthError();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchDashboardData();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center pb-20"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <Preloader fullScreen={true} />
      </div>
    );
  }

  if (!dashboardData && error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center pb-20"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <ErrorToast 
          message={error} 
          onRetry={fetchDashboardData}
          onDismiss={() => setError(null)}
        />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pb-20 text-white"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-2xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-center">Dashboard Overview</h1>
        </div>

        {/* Total Balance Card */}
        <div className="bg-gradient-to-r from-lime-700 to-green-800 p-6 rounded-xl backdrop-blur-sm border border-gray-700 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm text-gray-300 mb-1">Total Balance</h2>
              <p className="text-3xl md:text-4xl font-bold">
                ${dashboardData?.total_balance?.toLocaleString() || "0.00"}
              </p>
              <p className="text-sm text-slate-200 mt-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-slate-200 rounded-full mr-2"></span>
                Available for investment
              </p>
            </div>
            <div className="bg-lime-500 px-3 py-1 rounded-full text-xs">
              INVESTABLE
            </div>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-xl backdrop-blur-sm border border-gray-700 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm text-gray-300 mb-1">Total Earnings</h2>
              <p className="text-3xl md:text-4xl font-bold">
                ${dashboardData?.main_balance?.toLocaleString() || "0.00"}
              </p>
              <p className="text-sm text-green-400 mt-2 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Available for withdrawal
              </p>
            </div>
            <div className="bg-blue-600/30 px-3 py-1 rounded-full text-xs">
              WITHDRAWABLE
            </div>
          </div>
        </div>

        {/* Graph Section */}
        <div className="h-48 bg-gray-800 rounded-xl mb-8 backdrop-blur-sm border border-gray-700">
          <GraphSection data={dashboardData?.graph_data} />
        </div>

        {/* Enhanced Action Buttons Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Deposit Button - Enhanced */}
          <Link 
            to="/recharge" 
            className="group relative bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-xl border-2 border-green-500 hover:border-green-300 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-green-500/30 flex flex-col items-center text-center overflow-hidden active:scale-95"
          >
            <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="bg-green-500/20 p-3 rounded-full mb-2 group-hover:bg-green-500/30 transition-colors">
              <FontAwesomeIcon 
                icon={faMoneyBillWave} 
                className="text-green-200 text-xl group-hover:text-white transition-colors" 
              />
            </div>
            <h3 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">Deposit Funds</h3>
            <p className="text-xs text-green-100/80 group-hover:text-green-50 transition-colors">Add to your balance</p>
            <div className="mt-2 w-full">
              <span className="inline-block bg-green-500/40 text-white text-xs py-1 px-2 rounded-full group-hover:bg-green-500/60 transition-colors">
                Quick Deposit
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>

          {/* Withdraw Button - Enhanced */}
          <Link 
            to="/withdraw" 
            className="group relative bg-gradient-to-br from-yellow-600 to-yellow-700 p-4 rounded-xl border-2 border-yellow-500 hover:border-yellow-300 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-yellow-500/30 flex flex-col items-center text-center overflow-hidden active:scale-95"
          >
            <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="bg-yellow-500/20 p-3 rounded-full mb-2 group-hover:bg-yellow-500/30 transition-colors">
              <FontAwesomeIcon 
                icon={faWallet} 
                className="text-yellow-200 text-xl group-hover:text-white transition-colors" 
              />
            </div>
            <h3 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">Withdraw Earnings</h3>
            <p className="text-xs text-yellow-100/80 group-hover:text-yellow-50 transition-colors">Get your profits</p>
            <div className="mt-2 w-full">
              <span className="inline-block bg-yellow-500/40 text-white text-xs py-1 px-2 rounded-full group-hover:bg-yellow-500/60 transition-colors">
                Instant Withdrawal
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>

        {/* Investment Actions */}
        <div className="bg-gray-800 rounded-xl backdrop-blur-sm border border-gray-700 mb-8 overflow-hidden">
          <h2 className="text-lg font-semibold p-4 border-b border-gray-700">More actions</h2>
          
          <div className="divide-y divide-gray-700">
            {/* Active Bots */}
            <Link 
              to="/active-bots" 
              className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <FontAwesomeIcon icon={faRobot} className="text-blue-400 mr-3" />
                <span>Active Bots</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">
                  {dashboardData?.active_bots || 0} running
                </span>
                <FontAwesomeIcon icon={faArrowRight} className="text-gray-400" />
              </div>
            </Link>

            {/* Referral Earnings */}
            <Link 
              to="/referrals" 
              className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUserFriends} className="text-purple-400 mr-3" />
                <span>Referral Earnings</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">
                  ${dashboardData?.referral_commissions?.toLocaleString() || "0.00"}
                </span>
                <FontAwesomeIcon icon={faArrowRight} className="text-gray-400" />
              </div>
            </Link>
          </div>
        </div>

        {/* Announcement */}
        {dashboardData?.announcement && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-5 rounded-xl backdrop-blur-sm border border-gray-700">
            <div className="flex items-center mb-3">
              <FontAwesomeIcon icon={faBullhorn} className="text-yellow-400 mr-2" />
              <h2 className="text-lg font-semibold">Announcement</h2>
            </div>
            <p className="text-sm text-gray-300">
              {dashboardData.announcement}
            </p>
          </div>
        )}

        {/* Social Media Groups Section */}
        <div className="bg-gray-800 rounded-xl backdrop-blur-sm border border-gray-700 mt-8 overflow-hidden">
          <h2 className="text-lg font-semibold p-4 border-b border-gray-700">Join Our Community</h2>
          
          <div className="divide-y divide-gray-700">
            <a 
              href="https://wa.link/your-whatsapp-link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-green-600/20 p-2 rounded-full mr-3">
                  <FontAwesomeIcon icon={faWhatsapp} className="text-green-400" />
                </div>
                <span>WhatsApp Group</span>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="text-gray-400" />
            </a>

            <a 
              href="https://t.me/your-telegram-link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                  <FontAwesomeIcon icon={faTelegram} className="text-blue-400" />
                </div>
                <span>Telegram Community</span>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="text-gray-400" />
            </a>

            <a 
              href="http://localhost:3000/customer-service" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-gray-600/20 p-2 rounded-full mr-3">
                  <FontAwesomeIcon icon={faHeadset} className="text-gray-400" />
                </div>
                <span>Customer Service</span>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;