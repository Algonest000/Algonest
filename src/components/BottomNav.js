import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faRobot,
  faWallet,
  faUser,
  faExchangeAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Set active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("dashboard")) setActiveTab("home");
    else if (path.includes("bots")) setActiveTab("bots");
    else if (path.includes("wallet")) setActiveTab("wallet");
    else if (path.includes("transactions")) setActiveTab("transactions");
    else if (path.includes("account")) setActiveTab("account");
    else setActiveTab("");
  }, [location]);

  const handleNavigation = (path) => {
    navigate(path);
    setShowQuickActions(false);
  };

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  const navItems = [
    { path: "/dashboard", icon: faHome, label: "Home", id: "home" },
    { path: "/bots", icon: faRobot, label: "Bots", id: "bots" },
    { path: "/wallet", icon: faWallet, label: "Wallet", id: "wallet" },
    { 
      path: "/transactions", 
      icon: faExchangeAlt, 
      label: "Txn's", 
      id: "transactions" 
    },
    { path: "/account", icon: faUser, label: "Account", id: "account" },
  ];

  return (
    <>
      {/* Quick Actions Menu (appears above the nav when toggled) */}
      {showQuickActions && (
        <div className="fixed bottom-16 right-4 bg-gray-700 rounded-lg shadow-lg p-2 z-50 animate-fade-in">
          <div 
            className="p-3 rounded-md hover:bg-gray-600 mb-2 flex items-center"
            onClick={() => handleNavigation("/quick-deposit")}
          >
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
            </span>
            <span>Quick Deposit</span>
          </div>
          <div 
            className="p-3 rounded-md hover:bg-gray-600 flex items-center"
            onClick={() => handleNavigation("/new-bot")}
          >
            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
              <FontAwesomeIcon icon={faRobot} className="text-xs" />
            </span>
            <span>New Bot</span>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white shadow-lg z-40 border-t border-gray-700">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all ${
                activeTab === item.id ? "text-blue-400 bg-gray-700" : "hover:text-gray-300"
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <FontAwesomeIcon 
                icon={item.icon} 
                className={`text-lg ${activeTab === item.id ? "scale-110" : ""}`} 
              />
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          ))}
          
          {/* Quick Action Button
          <div
            className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all ${
              showQuickActions ? "text-blue-400 bg-gray-700" : "hover:text-gray-300"
            }`}
            onClick={toggleQuickActions}
          >
            <div className="relative">
              <FontAwesomeIcon 
                icon={faPlus} 
                className={`text-lg ${showQuickActions ? "rotate-45 scale-110" : ""} transition-transform`} 
              />
            </div>
            <span className="text-xs mt-1">Quick</span>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default BottomNav;