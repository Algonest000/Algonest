import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import SignupScreen from './screens/SignupScreen';
import Dashboard from './screens/Dashboard';
import ReferralProgram from './screens/ReferralProgram';
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";
import BotsPage from "./screens/Bots";
import LearnMore from "./screens/LearnMore";
import Preloader from "./components/Preloader";
import Wallets from "./screens/Wallets";
import Profile from "./screens/Profile";
import CustomerServiceComplaint from "./screens/CustomerServiceComplaint ";
import Login from "./screens/Login";
import ActiveBots from "./screens/ActiveBots";
import ActiveBotDetails from "./screens/ActiveBotDetails";
import Recharge from "./screens/Recharge";
import Withdraw from "./screens/Withdraw";
import ChangePassword from "./screens/ChangePassword";
import Transactions from "./screens/Transactions";
import VerifyEmail from "./screens/CheckVarification"
import Test from "./screens/Test";
import TermsAndConditions from "./screens/TermsAndConditions";
import bg from './bg.gif';

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div 
      className="min-h-screen text-white relative bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ 
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} >
      {/* Main content container */}
      <div className="relative z-10 min-h-screen">
        {loading && <Preloader />}
        <Routes>
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/referrals" element={<ReferralProgram />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:key" element={<ResetPassword />} />
          <Route path="/bots" element={<BotsPage />} />
          <Route path="/learn-more/:id" element={<LearnMore />} />
          <Route path="/wallet" element={<Wallets />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/customer-service" element={<CustomerServiceComplaint />} />
          <Route path="/login" element={<Login />} />
          <Route path="/active-bots" element={<ActiveBots />} />
          <Route path="/active-bot-details/:id" element={<ActiveBotDetails />} />
          <Route path="/recharge" element={<Recharge />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </div>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;