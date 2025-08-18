import React, { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { Link } from "react-router-dom";
import axios from "axios";

import astraquant from "../AstraQuant.jpg";
import aurumedge from "../AurumEdge.jpg";
import equiscan from "../EquiScan.jpg";
import nexatrader from "../NexaTrader.jpg";
import fxstream from "../FxStrean.jpg";
import marketmosaic from "../MarketMosaic.jpg";

// Background images for different screen sizes
const bgSmall = './bg-small.jpg';
const bgMedium = './bg-medium.jpg';
const bgLarge = './bg-large.jpg';

// Create a mapping between bot names/titles and their images
const botImages = {
  "AstraQuant": astraquant,
  "AurumEdge": aurumedge,
  "EquiScan": equiscan,
  "NexaTrader": nexatrader,
  "FxStream": fxstream,
  "MarketMosaic": marketmosaic
};

const BotsPage = () => {
  const [botsData, setBotsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentStatus, setInvestmentStatus] = useState({ success: false, message: "" });
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
    const fetchBotsData = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("User not authenticated. Please log in.");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          "https://7b62714cd9f9.ngrok-free.app/AlgonestDigitals/bots.php",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.data.success && Array.isArray(response.data.data)) {
          setBotsData(response.data.data);
        } else {
          setError(response.data.error || "Unexpected response format.");
        }
      } catch (error) {
        setError(
          error.response?.data?.error || "Failed to fetch bots data. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBotsData();
  }, []);

  const handleInvestNow = async (botId) => {
    setIsInvesting(true);
    setInvestmentStatus({ success: false, message: "" });

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("User not authenticated. Please log in.");
      }

      const response = await axios.post(
        "https://7b62714cd9f9.ngrok-free.app/AlgonestDigitals/purchase_bot.php",
        { bot_id: botId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setInvestmentStatus({
          success: true,
          message: response.data.message || "Investment successful!"
        });
      } else {
        throw new Error(response.data.error || "Investment failed");
      }
    } catch (error) {
      setInvestmentStatus({
        success: false,
        message: error.response?.data?.error || error.message || "Failed to process investment"
      });
    } finally {
      setIsInvesting(false);
      
      setTimeout(() => {
        setInvestmentStatus({ success: false, message: "" });
      }, 5000);
    }
  };

  // Function to get the appropriate image for a bot
  const getBotImage = (botTitle) => {
    const imageKey = Object.keys(botImages).find(key => 
      botTitle.toLowerCase().includes(key.toLowerCase())
    );
    return imageKey ? botImages[imageKey] : nexatrader;
  };

  return (
    <div 
      className="mb-14 md:mb-14 text-white min-h-screen p-6"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-3xl font-bold mb-8 pt-6">Available Trading Bots</h1>
        
        {investmentStatus.message && (
          <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            investmentStatus.success ? "bg-green-600" : "bg-red-600"
          }`}>
            {investmentStatus.message}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-red-900/50 rounded-lg max-w-md mx-auto">
            <p className="text-red-300">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {botsData.map((bot) => (
              <div
                key={bot.id}
                className="p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-gray-700 hover:border-blue-500"
              >
                <div className="relative h-48 w-full overflow-hidden rounded-md mb-3">
                  <img
                    src={getBotImage(bot.title)}
                    alt={bot.name}
                    className="absolute inset-0 w-full h-full object-fit transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <h2 className="text-lg font-bold">{bot.title}</h2>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-3 text-sm min-h-[50px]">{bot.description}</p>
                
                <div className="mb-3">
                  <h3 className="font-semibold text-md mb-2 text-blue-400">Key Features</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center border-b border-gray-700 pb-1">
                      <span className="text-gray-400 text-sm">Bot Fee</span>
                      <span className="font-medium text-sm">$ {bot.price}</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-gray-700 pb-1">
                      <span className="text-gray-400 text-sm">Potential Return</span>
                      <span className="font-medium text-sm text-green-400">{bot.potential_return}%</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-gray-700 pb-1">
                      <span className="text-gray-400 text-sm">Duration</span>
                      <span className="font-medium text-sm">{bot.days} days</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleInvestNow(bot.id)}
                    disabled={isInvesting}
                    className={`flex-1 ${
                      isInvesting 
                        ? 'bg-blue-700 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white font-medium py-2 px-3 rounded-md transition-all duration-300 hover:shadow-lg text-sm`}
                  >
                    {isInvesting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : "Invest Now"}
                  </button>
                  <Link to={`/learn-more/${bot.id}`} className="flex-1">
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-3 rounded-md transition-all duration-300 hover:shadow-lg text-sm">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default BotsPage;