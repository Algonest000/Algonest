import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faCoins, 
  faCalendarAlt, 
  faClock, 
  faChartLine,
  faPercentage,
  faWallet
} from "@fortawesome/free-solid-svg-icons";

// Background images for different screen sizes
const bgSmall = './bg-small.jpg';
const bgMedium = './bg-medium.jpg';
const bgLarge = './bg-large.jpg';

const ActiveBotDetails = () => {
  const { id } = useParams();
  const [bot, setBot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);

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
    const fetchBotDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("User not authenticated. Please log in.");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          `https://api.algonestdigitals.com/api/active_bot_details.php?id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.data.success && response.data.bot_details) {
          setBot(response.data.bot_details);
        } else {
          setError(response.data.error || "Bot not found.");
        }
      } catch (error) {
        setError(
          error.response?.data?.error ||
            "Failed to fetch bot details. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBotDetails();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div 
        className="text-white min-h-screen flex items-center justify-center pb-20"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="text-white min-h-screen flex flex-col items-center justify-center pb-20"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="bg-gray-800/90 p-8 rounded-xl max-w-md mx-auto backdrop-blur-sm border border-gray-700 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link 
            to="/active-bots" 
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium"
          >
            Back to Active Bots
          </Link>
        </div>
      </div>
    );
  }

  if (!bot) {
    return null;
  }

  return (
    <div 
      className="text-white min-h-screen pb-20"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link 
            to="/active-bots" 
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Active Bots
          </Link>
        </div>

        <div className="bg-gray-800/90 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-700">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{bot.name}</h1>
                <p className="text-gray-400">{bot.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bot.status_class}`}>
                {bot.status}
              </span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="mb-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-400">
                  Day {bot.days_completed} of {bot.original_days}
                </span>
                <span className="text-gray-400">
                  {bot.days_remaining > 0 ? `${bot.days_remaining} days remaining` : 'Completed'}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  style={{ width: `${bot.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 border-b border-gray-700">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faCoins} className="text-yellow-400 mr-3" />
                <h3 className="font-semibold">Net Profit</h3>
              </div>
              <p className="text-2xl font-bold">$ {bot.net_profit}</p>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faPercentage} className="text-blue-400 mr-3" />
                <h3 className="font-semibold">ROI</h3>
              </div>
              <p className="text-2xl font-bold">{bot.potential_return}%</p>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-400 mr-3" />
                <h3 className="font-semibold">Started</h3>
              </div>
              <p className="text-xl">{formatDate(bot.purchase_date)}</p>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faClock} className="text-red-400 mr-3" />
                <h3 className="font-semibold">Ends</h3>
              </div>
              <p className="text-xl">{formatDate(bot.expiry_date)}</p>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-400 mb-1">Investment</h3>
                <p className="text-lg font-bold">$ {bot.investment}</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-400 mb-1">Targeted Profit</h3>
                <p className="text-lg font-bold">$ {bot.targeted_profit}</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-blue-400">Bot Strategy</h2>
            <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
              <p className="text-gray-300">{bot.full_description || "This trading bot utilizes advanced algorithms to analyze market trends and execute trades automatically for optimal returns."}</p>
            </div>

            {/* <h2 className="text-xl font-semibold mb-4 text-blue-400">Recent Activity</h2> */}
            {/* <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center justify-between py-2 border-b border-gray-600">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faChartLine} className="text-green-400 mr-3" />
                  <span>Trade executed</span>
                </div>
                <span className="text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-600">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faWallet} className="text-blue-400 mr-3" />
                  <span>Profit realized</span>
                </div>
                <span className="text-green-400">$ +1,250</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faChartLine} className="text-green-400 mr-3" />
                  <span>Trade executed</span>
                </div>
                <span className="text-gray-400">5 hours ago</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ActiveBotDetails;