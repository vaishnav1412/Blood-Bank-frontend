import { useState, useEffect} from "react";
import "./hedder-component.scss";
import { Dialog } from "@headlessui/react";
import { 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  HeartIcon
} from "@heroicons/react/24/outline";
import { useNavigate, NavLink } from "react-router-dom";
import getData from "../../utility-functions/fetch-data-doner";

// Logo imports
import BlackLogo from "../../../../public/HemoCell Logo black.png";
import WhiteLogo from "../../../../public/Gemini_Generated_Image_twae1mtwae1mtwae-removebg-preview.png";

const companyName = "Kannur Blood Link";

const HeaderComponent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blurActivation, setBlurActivation] = useState(false);
  const [isActiveName, setIsActiveName] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const reuseableClass = {
    for_last: `last:bg-button_original last:text-white last:hover:bg-white last:hover:text-dark`,
    for_second_last: `rounded-rsm border border-white/[.5] hover:bg-white hover:text-dark`,
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Host Blood Drive", href: "/host-blood-drive" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact Us", href: "/contact" },
    { name: "Need Blood", href: "/need-blood", secondLast: true },
    user
      ? {
          name:
            user.name && user.name.length > 12
              ? user.name.slice(0, 10) + "..."
              : user.name || "Profile",
          href: "/doner-profile",
          last: true,
        }
      : { name: "Doner Login", href: "/login", last: true },
  ];

  // Mobile navigation with icons
  const mobileNavigation = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Host Blood Drive", href: "/host-blood-drive", icon: "🏥" },
    { name: "Gallery", href: "/gallery", icon: "📸" },
    { name: "Contact Us", href: "/contact", icon: "📞" },
    { name: "Need Blood", href: "/need-blood", icon: "🩸", highlight: true },
    user
      ? {
          name: user.name?.split(' ')[0] || "Profile",
          href: "/doner-profile",
          icon: "👤",
          last: true,
        }
      : { name: "Doner Login", href: "/login", icon: "🔑", last: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/donate-blood");
  };

  useEffect(() => {
    getData(setUser);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setBlurActivation(window.pageYOffset > 5);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/[.2]  ${
        blurActivation
          ? "bg-dark/[.7] backdrop-blur-md transition duration-1000"
          : ""
      }`}
    >
      <nav
        className="flex items-center justify-between p-6 lg:px-8 w-[min(1250px,100%-15px)] m-auto"
        aria-label="Global"
      >
        {/* Logo - Original Desktop */}
        <div className="flex lg:flex-1 ">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">{companyName}</span>
            <img className="w-auto h-10 " src={WhiteLogo} alt="" />
          </a>
        </div>

        {/* Mobile menu button hidden on large screens */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-off_white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation - ORIGINAL DESIGN */}
        <div className="hidden lg:flex lg:gap-x-4 lg:transition">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              onClick={() => {
                setIsActiveName(item.name);
                setMobileMenuOpen(false);
              }}
              to={item.href}
              className={`text-sm font-medium hover:bg-button_original transition leading-6 text-off_white px-3 py-2 rounded-rsm
                ${item.secondLast && reuseableClass.for_second_last}
                ${item.last && reuseableClass.for_last}
                ${isActiveName === item.name ? "bg-button_original" : ""}
              `}
            >
              {item.name}
            </NavLink>
          ))}

          {user && (
          <button 
  onClick={handleLogout}
  className="group relative flex items-center justify-center w-10 h-10 sm:w-auto sm:px-5 sm:py-2.5 bg-gradient-to-r from-light_red to-red border border-white/20 rounded-rmd sm:rounded-lg hover:from-red-800 hover:to-rose-800 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/50 overflow-hidden"
>
  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
  
  <span className="relative flex items-center justify-center">
    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  </span>
  
  <span className="relative hidden sm:block ml-2 text-sm font-bold text-white">
    Logout
  </span>
</button>
          )}
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl">
          {/* Enhanced Mobile Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-red-50">
            <div className="flex items-center space-x-3">
              <img className="w-auto h-10" src={BlackLogo} alt={companyName} />
              <div>
                <div className="font-bold text-gray-900">{companyName}</div>
                <div className="text-xs text-gray-600">Life is in your blood</div>
              </div>
            </div>
            <button
              type="button"
              className="-m-2.5 rounded-lg p-2.5 text-gray-700 hover:bg-white/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* User Info in Mobile (Enhanced) */}
          {user && (
            <div className="px-6 py-5 bg-gradient-to-r from-pink-600 to-red-600 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm opacity-90">{user.email}</div>
                  <div className="mt-2 flex items-center space-x-3">
                    <div className="text-center">
                      <div className="font-bold">{user.totalDonations || 0}</div>
                      <div className="text-xs opacity-80">Donations</div>
                    </div>
                    <div className="w-px h-6 bg-white/30" />
                    <div className="text-center">
                      <div className="font-bold">{((user.totalDonations || 0) * 3)}</div>
                      <div className="text-xs opacity-80">Lives Saved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Mobile Navigation with Icons */}
          <div className="py-6">
            <div className="space-y-1 px-4">
              {mobileNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    setIsActiveName(item.name);
                    setMobileMenuOpen(false);
                  }}
                  className={({ isActive }) => `
                    flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-pink-50 to-red-50 text-pink-700 border-l-4 border-pink-500' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-pink-600'
                    }
                    ${item.highlight ? 'font-semibold' : ''}
                  `}
                >
                  <span className="text-xl w-6 text-center">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                  {item.highlight && (
                    <span className="ml-auto px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full animate-pulse">
                      Hot
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Enhanced User Menu for Mobile */}
            {user && (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="space-y-1 px-4">
                  <NavLink
                    to="/donation-history"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                  >
                    <HeartIcon className="w-5 h-5" />
                    <span className="font-medium">Donation History</span>
                  </NavLink>
                  <NavLink
                    to="/certificates"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                  >
                    <span className="text-lg">📜</span>
                    <span className="font-medium">My Certificates</span>
                  </NavLink>
                  <NavLink
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                  >
                    <span className="text-lg">⚙️</span>
                    <span className="font-medium">Settings</span>
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-4 w-full px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <span className="text-lg">🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Auth Buttons for Mobile */}
            {!user && (
              <div className="mt-8 px-4 space-y-3">
                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-pink-600 to-red-600 text-white py-3.5 rounded-xl font-semibold text-center hover:shadow-lg transition-shadow"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>➕</span>
                    <span>Join as Donor</span>
                  </span>
                </NavLink>
                <div className="text-center text-sm text-gray-500 py-2">
                  Already have an account?
                </div>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full border-2 border-pink-600 text-pink-600 py-3 rounded-xl font-semibold text-center hover:bg-pink-50"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <UserCircleIcon className="w-5 h-5" />
                    <span>Login</span>
                  </span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Enhanced Mobile Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
            <div className="text-center">
              <div className="mb-3">
                <div className="text-sm font-semibold text-gray-900 mb-1">Need Emergency Help?</div>
                <div className="text-lg font-bold text-red-600 animate-pulse">108</div>
                <div className="text-xs text-gray-500">24/7 Emergency Helpline</div>
              </div>
              <div className="text-xs text-gray-400 pt-3 border-t border-gray-100">
                © 2024 {companyName}. All rights reserved.
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Original CSS styles */}
      <style >{`
        .Btn {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition-duration: 0.3s;
          box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
          background-color: rgb(239, 68, 68);
        }

        .sign {
          width: 100%;
          transition-duration: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sign svg {
          width: 14px;
          height: 14px;
        }

        .sign svg path {
          fill: white;
        }

        .text {
          position: absolute;
          right: 0%;
          width: 0%;
          opacity: 0;
          color: white;
          font-size: 0.9em;
          font-weight: 600;
          transition-duration: 0.3s;
        }

        .Btn:hover {
          width: 100px;
          border-radius: 40px;
          transition-duration: 0.3s;
        }

        .Btn:hover .sign {
          width: 30%;
          transition-duration: 0.3s;
          padding-left: 12px;
        }

        .Btn:hover .text {
          opacity: 1;
          width: 70%;
          transition-duration: 0.3s;
          padding-right: 8px;
        }

        .Btn:active {
          transform: translate(1px, 1px);
        }
      `}</style>
    </header>
  );
};

export default HeaderComponent;