import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faSignOutAlt, faHeadset, faUser, faRobot, faGift, faCoins } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import axios from "axios";

// Background images for different screen sizes
const bgSmall = './bg-small.jpg';
const bgMedium = './bg-medium.jpg';
const bgLarge = './bg-large.jpg';
const bgXLarge = './bg-xlarge.jpg';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);
  const navigate = useNavigate();

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
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          "https://api.algonestdigitals.com/AlgonestDigitals/public/profile",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setProfileData(response.data.data);
        } else {
          setError(response.data.error || "Failed to load profile data");
        }
      } catch (error) {
        setError(error.response?.data?.error || "Network error. Please try again.");
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user_id");
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center text-white"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center text-white p-4"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white flex flex-col items-center px-4 pb-20 pt-10" // Increased bottom padding
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="w-full max-w-lg space-y-6 mb-16"> {/* Added margin-bottom */}
        {/* User Info Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 rounded-full h-16 w-16 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-2xl" />
            </div>
          </div>
          <h2 className="text-2xl text-center font-bold mb-4">
            {profileData?.name || "User Name"}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <FontAwesomeIcon icon={faCoins} className="text-blue-400 mb-1" />
              <p className="text-lg font-semibold">
                $ {profileData?.total_referral_income?.toLocaleString() || "0"}
              </p>
              <p className="text-xs text-gray-400">Referral Income</p>
            </div>
            
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <FontAwesomeIcon icon={faRobot} className="text-green-400 mb-1" />
              <p className="text-lg font-semibold">
                $ {profileData?.bot_investment?.toLocaleString() || "0"}
              </p>
              <p className="text-xs text-gray-400">Bot Investment</p>
            </div>
            
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <FontAwesomeIcon icon={faGift} className="text-yellow-400 mb-1" />
              <p className="text-lg font-semibold">
                $ {profileData?.welcome_bonus?.toLocaleString() || "0"}
              </p>
              <p className="text-xs text-gray-400">Welcome Bonus</p>
            </div>
            
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <FontAwesomeIcon icon={faRobot} className="text-purple-400 mb-1" />
              <p className="text-lg font-semibold">
                {profileData?.bots || "0"}
              </p>
              <p className="text-xs text-gray-400">Active Bots</p>
            </div>
          </div>
        </div>
         {/* Balance Card */}
        {/* <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold">Total Balance</h3>
          <p className="text-3xl font-bold mt-2">
            $ {profileData?.total_earnings?.toLocaleString() || "0.00"}
          </p>
          <p className="text-sm text-blue-100">Total Available Balance</p>
        </div> */}

        {/* Account Details Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-400" />
            Account Details
          </h3>
          <div className="space-y-3">
            {[
              { label: "Referred By:", value: profileData?.referred_by || "N/A" },
              { label: "Email:", value: profileData?.email || "N/A" },
              { label: "Phone Number:", value: profileData?.phone_number || "N/A" },
              { label: "Account Created:", value: profileData?.date_joined || "N/A" },
              // { label: "Last Login:", value: profileData?.last_login || "N/A" }
            ].map((item, index) => (
              <div key={index} className="flex justify-between">
                <p className="text-gray-400">{item.label}</p>
                <p className="text-white text-right">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

       

        {/* Actions Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg space-y-4 backdrop-blur-sm mb-8"> {/* Added margin-bottom */}
          <h3 className="text-lg font-semibold">Account Actions</h3>
          
          <Link 
            to="/change-password" 
            className="flex items-center justify-between bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faKey} className="mr-3 text-yellow-400" />
              <span>Change Password</span>
            </div>
            <span>&rarr;</span>
          </Link>
          
          <Link 
            to="/customer-service" 
            className="flex items-center justify-between bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faHeadset} className="mr-3 text-green-400" />
              <span>Contact Support</span>
            </div>
            <span>&rarr;</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-between bg-gray-700 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors w-full"
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-red-400" />
              <span>Logout</span>
            </div>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Profile;