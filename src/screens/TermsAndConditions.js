import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Background images for different screen sizes
const bgSmall = './bg-small.jpg';    // 640x1136
const bgMedium = './bg-medium.jpg';  // 1280x800 
const bgLarge = './bg-large.jpg';    // 1920x1080
const bgXLarge = './bg-xlarge.jpg';  // 3840x2160

const TermsAndConditions = () => {
  const [backgroundImage, setBackgroundImage] = useState(bgLarge);

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

  return (
    <div 
      className="min-h-screen text-white p-4"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll',
      }}
    >
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1 sm:mb-2">TERMS AND CONDITIONS</h1>
        </div>

        <div className="prose prose-invert max-w-none text-sm sm:text-base">
          <p className="mb-4 sm:mb-6">
            Welcome to <span className="text-blue-400 font-semibold">Algonest</span>!
          </p>
          
          <p className="mb-6 sm:mb-8">
            These Terms and Conditions ("Agreement") govern your use of the Algonest crypto mining and investment platform ("Algonest", "we", "us", or "our"). By creating an account, accessing, or using our services, you agree to comply with and be bound by this Agreement. If you do not agree to these terms, please do not use the platform.
          </p>

          <h2 className="text-xl font-bold text-blue-400 mt-6 mb-3">1. ELIGIBILITY</h2>
          <p className="mb-6">
            You must be at least 18 years old or the legal age in your jurisdiction to use this platform. By using our services, you confirm that you meet the eligibility requirements.
          </p>

          <h2 className="text-xl font-bold text-blue-400 mt-6 mb-3">2. SERVICES OFFERED</h2>
          <p className="mb-6">
            Algonest provides cloud-based cryptocurrency mining and automated bot-based investment services. Users can rent mining power (hashrate) and/or invest in algorithmic bots that generate earnings based on market conditions, network difficulty, and platform performance.
          </p>

          <h2 className="text-xl font-bold text-blue-400 mt-6 mb-3">3. ACCOUNT REGISTRATION</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Users must register an account to access the platform's services.</li>
            <li>You are responsible for securing your login credentials.</li>
            <li>All actions taken under your account are your responsibility.</li>
            <li>You agree to provide accurate and up-to-date information.</li>
          </ul>

          <h2 className="text-xl font-bold text-blue-400 mt-6 mb-3">4. DEPOSITS AND INVESTMENTS</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>All deposits are final and non-refundable.</li>
            <li>Investments carry inherent risks. Only invest funds you can afford to lose.</li>
            <li>Welcome bonuses or promotional funds may not be withdrawn unless conditions are met.</li>
            <li>Algonest reserves the right to set minimum deposit and withdrawal thresholds.</li>
          </ul>

          <h2 className="text-xl font-bold text-blue-400 mt-6 mb-3">5. EARNINGS, BOTS & WITHDRAWALS</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Earnings are calculated based on real-time mining and bot activity, market volatility, and blockchain conditions.</li>
            <li>Prices of bots may change at any time based on performance, market demand, or platform upgrades.</li>
            <li>Withdrawals may be subject to minimum limits, processing fees, and identity verification (KYC) if necessary.</li>
            <li>Referral commissions (if applicable) are withdrawable once confirmed.</li>
          </ul>

          <h2 className="text-xl font-bold text-blue-400 mt-6 mb-3">6. RISK DISCLOSURE</h2>
          <p className="mb-6">
            Cryptocurrency trading and mining involve high financial risk. Past performance of bots or mining tools does not guarantee future returns. You understand and accept these risks.
          </p>

          <h2 className="text-xl font-bold text-blue-400 mt-6 mb-3">7. USER CONDUCT AND PROHIBITED USE</h2>
          <p className="mb-3">You agree NOT to:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Use Algonest for fraudulent, illegal, or unauthorized activities</li>
            <li>Attempt to hack, damage, or gain unauthorized access</li>
            <li>Misrepresent your identity</li>
            <li>Abuse referral systems or exploit bugs in the system</li>
          </ul>
          <p className="mb-6">
            Any violation may result in account suspension, blacklist, or legal action.
          </p>

          <h2 className="text-xl font-bold text-blue-400 mt-6 mb-3">8. LIMITATION OF LIABILITY</h2>
          <p className="mb-3">Algonest will not be held responsible for:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Market-related losses</li>
            <li>Service interruptions due to maintenance or external disruptions</li>
            <li>Blockchain or third-party wallet issues</li>
          </ul>
          <p className="mb-6">
            You use this platform at your own risk.
          </p>

          <h2 className="text-xl font-bold text-blue-400 mt-6 mb-3">9. TERMINATION</h2>
          <p className="mb-6">
            Algonest reserves the right to suspend, restrict, or terminate any account for violations of this Agreement, suspected fraud, or policy breaches without prior notice.
          </p>

          <h2 className="text-xl font-bold text-blue-400 mt-6 mb-3">10. CHANGES TO TERMS</h2>
          <p className="mb-6">
            These Terms may be updated from time to time. We will notify users through our platform. Continued use after any changes implies your acceptance of the new terms.
          </p>

          <h2 className="text-xl font-bold text-blue-400 mt-6 mb-3">11. GOVERNING LAW</h2>
          <p className="mb-6">
            This Agreement shall be governed by the laws of [Insert Jurisdiction/Country]. All disputes will be resolved under the applicable legal frameworks.
          </p>

          <h2 className="text-xl font-bold text-blue-400 mt-6 mb-3">12. CONTACT</h2>
          <p className="mb-6">
            For questions or assistance, please contact us:<br />
            Email: <span className="text-blue-400">Algonestoriginal@gmail.com</span><br />
            Website: <Link to="/contact" className="text-blue-400 hover:underline">www.algonest.com/contact</Link>
          </p>

          <div className="border-t border-gray-700 pt-6 mt-8">
            <p className="text-lg font-semibold text-center mb-4">
              BY CHECKING THE BOX AND USING THIS PLATFORM, YOU CONFIRM THAT YOU HAVE READ, UNDERSTOOD, AND AGREED TO THESE TERMS AND CONDITIONS IN FULL.
            </p>
            <p className="text-center text-gray-400">
              I have read and agree to the Terms and Conditions.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/signup" 
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors"
          >
            Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;