import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faCircleCheck, 
  faInfoCircle, 
  faCopy,
  faUserPlus,
  faCoins,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import BottomNav from "../components/BottomNav";
import AlertPopup from "../components/AlertPopup";

// Background images for different screen sizes
const bgSmall = './bg-small.jpg';
const bgMedium = './bg-medium.jpg';
const bgLarge = './bg-large.jpg';

const ReferralProgram = () => {
  const [referralData, setReferralData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState({ code: false, link: false });
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);
  const [alert, setAlert] = useState(null);

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
    const fetchReferralData = async () => {
      try {
        setIsLoading(true);
  
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("User not authenticated. Please log in.");
          setIsLoading(false);
          return;
        }
  
        const response = await axios.get(" https://7b62714cd9f9.ngrok-free.app/AlgonestDigitals/referrals.php", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
  
        if (response.data.success) {
          setReferralData(response.data.data);
        } else {
          setError(response.data.error || "Unexpected response format.");
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch referral data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchReferralData();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    showAlert("success", `${type === 'code' ? 'Referral code' : 'Referral link'} copied!`);
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
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
        <div className="bg-gray-800 p-6 rounded-xl max-w-md mx-auto backdrop-blur-sm border border-gray-700 text-center">
          <h1 className="text-xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const referralLink = `https://algonest-sooty.vercel.app/signup?ref=${referralData.referral_code}`;

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
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link 
            to="/dashboard" 
            className="text-gray-400 hover:text-white mr-3 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </Link>
          <h1 className="text-xl font-bold">Referral Program</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-xl backdrop-blur-sm border border-gray-700">
            <div className="flex items-center mb-2">
              <div className="bg-blue-600/20 p-2 rounded-full mr-3">
                <FontAwesomeIcon icon={faUserPlus} className="text-blue-400" />
              </div>
              <span className="text-sm text-gray-400">Total Referrals</span>
            </div>
            <p className="text-xl font-bold">
              {referralData.total_referred}
            </p>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl backdrop-blur-sm border border-gray-700">
            <div className="flex items-center mb-2">
              <div className="bg-green-600/20 p-2 rounded-full mr-3">
                <FontAwesomeIcon icon={faCoins} className="text-green-400" />
              </div>
              <span className="text-sm text-gray-400">Active Referrals</span>
            </div>
            <p className="text-xl font-bold">
              {referralData.depositors_count}
            </p>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700 p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <FontAwesomeIcon icon={faCopy} className="text-blue-400 mr-2" />
            Your Referral Code
          </h3>
          <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg border border-gray-600">
            <p className="font-mono break-all">{referralData.referral_code}</p>
            <button
              onClick={() => copyToClipboard(referralData.referral_code, 'code')}
              className={`ml-3 px-3 py-1 rounded-md text-sm font-medium ${
                copied.code ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {copied.code ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700 p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <FontAwesomeIcon icon={faChartLine} className="text-purple-400 mr-2" />
            Your Referral Link
          </h3>
          <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg border border-gray-600">
            <p className="text-sm text-gray-300 truncate">{referralLink}</p>
            <button
              onClick={() => copyToClipboard(referralLink, 'link')}
              className={`ml-3 px-3 py-1 rounded-md text-sm font-medium ${
                copied.link ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {copied.link ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Earnings Section - CONVERTED TO BAR CHART */}
        <div className="bg-gray-800 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <FontAwesomeIcon icon={faCoins} className="text-yellow-400 mr-2" />
              Total Referral Earnings
            </h3>
            <span className="text-xl font-bold text-green-400">
              ${referralData.total_referral_earnings?.toLocaleString()}
            </span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={referralData.earnings_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" vertical={false} />
                <XAxis 
                  dataKey="referred_users" 
                  stroke="#A3A3A3" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#A3A3A3" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    borderColor: '#4B5563',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value) => [`$${value}`, 'Earnings']}
                  labelFormatter={(label) => `Referral: ${label}`}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#FF4500" 
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bonus Program */}
        <div className="bg-gray-800 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FontAwesomeIcon icon={faCircleCheck} className="text-green-400 mr-2" />
            Salary Bonus Program
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            Get $12 monthly salary when you refer 2+ active users who make deposits.
          </p>
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              referralData.is_eligible === "Eligible" 
                ? 'bg-green-600 text-green-100' 
                : 'bg-red-600 text-red-100'
            }`}>
              {referralData.is_eligible}
            </span>
            <span className="ml-3 text-sm text-gray-400">
              {referralData.depositors_count} active referrals
            </span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-800 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700 p-4">
            <div className="flex items-start">
              <FontAwesomeIcon icon={faInfoCircle} className="text-yellow-400 mt-1 mr-3" />
              <div>
                <h3 className="font-bold mb-2">Important Notes</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2"></span>
                    <span>Minimum withdrawal amount: $3</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2"></span>
                    <span>Bonuses are only for active referrals (users who deposit)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2"></span>
                    <span>20% bonus for each active referral</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ReferralProgram;