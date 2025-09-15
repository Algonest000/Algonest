import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChartLine, faCalendarAlt, faClock, faCoins } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import BottomNav from "../components/BottomNav";

// Background images for different screen sizes
const bgSmall = './bg-small.jpg';
const bgMedium = './bg-medium.jpg';
const bgLarge = './bg-large.jpg';

const ActiveBots = () => {
  const [activeBots, setActiveBots] = useState([]);
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
    const fetchActiveBots = async () => {
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
          "https://api.algonestdigitals.com/api/active_bots.php",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.data.success && response.data.active_bots) {
          setActiveBots(response.data.active_bots);
        } else {
          setError(response.data.error || "No active bots found.");
        }
      } catch (error) {
        setError(
          error.response?.data?.error ||
            "Failed to fetch active bots. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveBots();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div 
        className="text-white min-h-screen flex items-center justify-center pb-20"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
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
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="bg-gray-800 p-8 rounded-xl max-w-md mx-auto backdrop-blur-sm border border-gray-700 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link 
            to="/dashboard" 
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
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
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            to="/dashboard" 
            className="text-gray-400 hover:text-white mr-4 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Your Active Trading Bots</h1>
        </div>

        {activeBots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBots.map((bot) => (
              <div
                key={bot.id}
                className="bg-gray-800/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-gray-700 hover:border-blue-500 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">{bot.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bot.status_class}`}>
                      {bot.status}
                    </span>
                  </div>

                  <p className="text-gray-400 mb-5">{bot.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-400">
                        Day {bot.days_completed} of {bot.original_days}
                      </span>
                      <span className="text-gray-400">
                        {bot.days_remaining > 0 ? `${bot.days_remaining} days left` : 'Completed'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                        style={{ width: `${bot.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCoins} className="text-yellow-400 mr-3" />
                      <div>
                        <p className="text-gray-400 text-sm">Net Profit</p>
                        <p className="font-semibold">$ {bot.net_profit}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faChartLine} className="text-blue-400 mr-3" />
                      <div>
                        <p className="text-gray-400 text-sm">ROI</p>
                        <p className="font-semibold">{bot.potential_return}%</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-400 mr-3" />
                      <div>
                        <p className="text-gray-400 text-sm">Started</p>
                        <p className="font-semibold">{formatDate(bot.purchase_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faClock} className="text-red-400 mr-3" />
                      <div>
                        <p className="text-gray-400 text-sm">Ends</p>
                        <p className="font-semibold">{formatDate(bot.expiry_date)}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/active-bot-details/${bot.id}`}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2 px-4 rounded-md transition-all duration-300 hover:shadow-lg"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/90 rounded-xl p-8 text-center backdrop-blur-sm border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">No Active Bots</h2>
            <p className="text-gray-400 mb-6">You don't have any active trading bots yet.</p>
            <Link
              to="/bots"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-300"
            >
              Explore Bots
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ActiveBots;