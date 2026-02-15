import { useState, useEffect } from "react";
import "./hedder-component.scss";
import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, NavLink } from "react-router-dom";
import { getDonorInfo } from "../../../services/donorServices";
import BlackLogo from "../../../../public/HemoCell Logo black.png";
import WhiteLogo from "../../../../public/Gemini_Generated_Image_twae1mtwae1mtwae-removebg-preview.png";
import {
  getNavigation,
  getMobileNavigation,
} from "../../../data/content/headder";

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

  const navigation = getNavigation(user);
  const mobileNavigation = getMobileNavigation(user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("donor");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getDonorInfo();
        setUser(userData);
      } catch (err) {
        console.log("User not logged in");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setBlurActivation(window.pageYOffset > 5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`header-wrapper fixed inset-x-0 top-0 z-50 border-b border-white/[.2] transition-all duration-500 ${
        blurActivation
          ? "bg-dark/[.7] backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav
        className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1 z-10">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">{companyName}</span>
            <img className="h-8 w-auto md:h-10" src={WhiteLogo} alt="Logo" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden z-10">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-off_white hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-2 xl:gap-x-4 items-center">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              onClick={() => setIsActiveName(item.name)}
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-medium leading-6 text-off_white px-3 py-2 rounded-rsm transition-all duration-200
                ${item.secondLast ? reuseableClass.for_second_last : ""}
                ${item.last ? reuseableClass.for_last : ""}
                ${isActive || isActiveName === item.name ? "bg-button_original text-white" : "hover:bg-white/10"}
                whitespace-nowrap`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {user && (
            <button
              onClick={handleLogout}
              className="logout-btn-wrapper group flex items-center justify-center h-9 w-9 lg:w-auto lg:px-4 lg:py-2 bg-gradient-to-r from-light_red to-red border border-white/20 rounded-rmd hover:from-red-800 hover:to-rose-800 transition-all duration-300 overflow-hidden"
            >
              {/* Icon always visible */}
              <span className="logout-icon flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </span>

              {/* Text hidden on smaller desktops, visible on hover/xl screens */}
              <span className="logout-text hidden lg:group-hover:inline-block ml-2 text-sm font-bold text-white whitespace-nowrap">
                Logout
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

        <Dialog.Panel className="mobile-menu-panel fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-red-50">
            <div className="flex items-center space-x-3">
              <img className="h-8 w-auto" src={BlackLogo} alt={companyName} />
              <div>
                <div className="font-bold text-gray-900 text-sm">
                  {companyName}
                </div>
                <div className="text-xs text-gray-500">
                  Life is in your blood
                </div>
              </div>
            </div>
            <button
              type="button"
              className="-m-2.5 rounded-lg p-2.5 text-gray-700 hover:bg-white/70 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="px-5 py-4 bg-gradient-to-r from-pink-600 to-red-600 text-white">
              <div className="flex items-center space-x-4">
                <div className="user-avatar w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border border-white/30">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{user.name}</div>
                  <div className="text-sm opacity-90 truncate">
                    {user.email}
                  </div>
                  <div className="mt-2 flex items-center space-x-3">
                    <div className="text-center">
                      <div className="font-bold">
                        {user.totalDonations || 0}
                      </div>
                      <div className="text-[10px] opacity-80 uppercase tracking-wide">
                        Donations
                      </div>
                    </div>
                    <div className="w-px h-6 bg-white/30" />
                    <div className="text-center">
                      <div className="font-bold">
                        {(user.totalDonations || 0) * 3}
                      </div>
                      <div className="text-[10px] opacity-80 uppercase tracking-wide">
                        Lives Saved
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="py-4">
            <div className="space-y-1 px-3">
              {mobileNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    nav-item flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? "nav-item-active text-pink-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-pink-600"
                    }
                    ${item.highlight ? "bg-pink-50/50" : ""}
                  `}
                >
                  <span className="text-xl w-6 text-center opacity-80">
                    {item.icon}
                  </span>
                  <span className="font-medium flex-1">{item.name}</span>
                  {item.highlight && (
                    <span className="ml-auto px-2 py-0.5 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] rounded-full animate-pulse">
                      Hot
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* User Specific Mobile Links */}
            {user && (
              <div className="mt-4 border-t border-gray-100 pt-4 px-3">
                <div className="space-y-1">
                  <NavLink
                    to="/donation-history"
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-item flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                  >
                    <HeartIcon className="w-5 h-5 opacity-80" />
                    <span className="font-medium">Donation History</span>
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="nav-item logout-button w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <span className="text-lg w-6 text-center">🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}

            {/* Auth Buttons for Guests */}
            {!user && (
              <div className="mt-4 px-4 space-y-3">
                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-pink-600 to-red-600 text-white py-3 rounded-xl font-semibold text-center hover:shadow-lg transition-all duration-300"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>➕</span>
                    <span>Join as Donor</span>
                  </span>
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full border-2 border-pink-600 text-pink-600 py-2.5 rounded-xl font-semibold text-center hover:bg-pink-50"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <UserCircleIcon className="w-5 h-5" />
                    <span>Login</span>
                  </span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Emergency Footer */}
          <div className="mobile-footer absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-white border-t border-gray-100">
            <div className="emergency-section text-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 mb-1">
                Need Emergency Help?
              </div>
              <div className="text-2xl font-bold text-red-600 emergency-number">
                108
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                24/7 Emergency Helpline
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default HeaderComponent;
