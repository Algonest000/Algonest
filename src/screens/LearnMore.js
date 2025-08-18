import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import BottomNav from "../components/BottomNav";

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

const LearnMore = () => {
  const { id } = useParams();
  const [bot, setBot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentStatus, setInvestmentStatus] = useState({ success: false, message: "" });
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);

  // Function to get the appropriate image for a bot
  const getBotImage = (botTitle) => {
    const imageKey = Object.keys(botImages).find(key => 
      botTitle.toLowerCase().includes(key.toLowerCase())
    );
    return imageKey ? botImages[imageKey] : nexatrader;
  };

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
          `https://7b62714cd9f9.ngrok-free.app/AlgonestDigitals/bot_details.php?id=${id}`,
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
          setError(response.data.error || "Bot details not found.");
        }
      } catch (error) {
        setError(
          error.response?.data?.error || "Failed to fetch bot details. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBotDetails();
  }, [id]);

  const handleInvestNow = async () => {
    if (!bot) return;
    
    setIsInvesting(true);
    setInvestmentStatus({ success: false, message: "" });

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("User not authenticated. Please log in.");
      }

      const response = await axios.post(
        "https://7b62714cd9f9.ngrok-free.app/AlgonestDigitals/purchase_bot.php",
        { bot_id: id },
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

  if (isLoading) {
    return (
      <div 
        className="text-white min-h-screen flex items-center justify-center"
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
        className="text-white min-h-screen flex items-center justify-center"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="text-center p-8 bg-gray-800 rounded-lg max-w-md mx-auto backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link 
            to="/bots" 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium"
          >
            Back to Bots
          </Link>
        </div>
      </div>
    );
  }

  if (!bot) {
    return null; // Already handled in error state
  }

  return (
    <div 
      className="text-white min-h-screen pb-20"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {investmentStatus.message && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
          investmentStatus.success ? "bg-green-600" : "bg-red-600"
        }`}>
          {investmentStatus.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-700">
          {/* Hero Section with Bot Image */}
          <div className="relative h-64 md:h-80 w-full overflow-hidden">
            <img
              src={getBotImage(bot.title)}
              alt={bot.title}
              className="absolute inset-0 w-full h-full object-fit md:object-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 p-6 z-20">
              <h1 className="text-3xl md:text-4xl font-bold">{bot.title}</h1>
              <p className="text-gray-300 mt-2">{bot.short_description}</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">About This Bot</h2>
                <p className="text-gray-300 leading-relaxed mb-6">{bot.full_description}</p>
                
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">How It Works</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {bot.how_it_works || "This trading bot utilizes advanced algorithms to analyze market trends and execute trades automatically for optimal returns."}
                </p>
              </div>

              {/* Stats Sidebar */}
              <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 h-fit">
                <h3 className="text-xl font-semibold mb-4 text-center">Investment Details</h3>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center pb-3 border-b border-gray-600">
                    <span className="text-gray-400">Price:</span>
                    <span className="font-bold text-lg">$ {bot.price} </span>
                  </li>
                  <li className="flex justify-between items-center pb-3 border-b border-gray-600">
                    <span className="text-gray-400">Target Profit:</span>
                    <span className="font-bold text-green-400">$ {bot.targeted_profit}</span>
                  </li>
                  <li className="flex justify-between items-center pb-3 border-b border-gray-600">
                    <span className="text-gray-400">Potential Return:</span>
                    <span className="font-bold text-green-400">{bot.potential_return}%</span>
                  </li>
                  <li className="flex justify-between items-center pb-3 border-b border-gray-600">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-bold">{bot.investment_duration} days</span>
                  </li>
                  <li className="flex justify-between items-center pb-3 border-b border-gray-600">
                    <span className="text-gray-400">Risk Level:</span>
                    <span className="font-bold text-yellow-400">Medium</span>
                  </li>
                </ul>

                <button 
                  onClick={handleInvestNow}
                  disabled={isInvesting}
                  className={`mt-6 w-full ${
                    isInvesting 
                      ? 'bg-blue-700 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-bold py-3 px-4 rounded-md transition-all duration-300`}
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
              </div>
            </div>

            {/* Additional Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "24/7 Automated Trading",
                  "Real-time Market Analysis",
                  "Risk Management System",
                  "Performance Tracking",
                  "Secure Transactions",
                  "Dedicated Support"
                ].map((feature, index) => (
                  <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <div className="flex items-center">
                      <div className="mr-3 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span>{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-center mt-8">
              <Link 
                to="/bots" 
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 font-medium transition-colors"
              >
                Back to All Bots
              </Link>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default LearnMore;