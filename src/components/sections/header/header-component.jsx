// HeaderComponent.jsx
import { useState, useEffect } from "react";
import "./hedder-component.scss";
import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { getDonorInfo } from "../../../services/donorServices";

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
  const location = useLocation();

  const reuseableClass = {
    for_last: `last:bg-primary last:text-white last:hover:bg-primary-dark last:hover:text-white`,
    for_second_last: `rounded-rsm border border-white/20 hover:bg-white hover:text-primary-dark`,
  };

  const navigation = getNavigation(user);
  const mobileNavigation = getMobileNavigation(user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("donor");
    setUser(null);
    setMobileMenuOpen(false);
    navigate("/");
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const isActiveRoute = (href) => {
    return location.pathname === href;
  };

  return (
    <header
      className={`header-wrapper fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        blurActivation
          ? "header-scrolled bg-dark/80 backdrop-blur-xl shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <nav
        className="flex items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto h-16 lg:h-20"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1 z-10">
          <a
            href="/"
            className="logo-container -m-1.5 p-1.5 flex items-center gap-2"
          >
            <span className="sr-only">{companyName}</span>
            <img
              className="logo-image h-8 w-auto md:h-10 transition-transform duration-300 hover:scale-110"
              src={WhiteLogo}
              alt="Logo"
            />
            <span className="company-name hidden sm:block text-sm font-semibold text-white">
              {companyName}
            </span>
          </a>
        </div>

        {/* Desktop Navigation - Hidden on Mobile */}
        <div className="hidden lg:flex lg:gap-x-1 xl:gap-x-2 items-center">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              onClick={() => setIsActiveName(item.name)}
              to={item.href}
              className={({ isActive }) =>
                `desktop-nav-link text-sm font-medium leading-6 text-off_white px-3 xl:px-4 py-2 rounded-xl transition-all duration-300 relative group
                ${item.secondLast ? reuseableClass.for_second_last : ""}
                ${item.last ? reuseableClass.for_last : ""}
                ${isActive || isActiveName === item.name ? "nav-link-active" : "hover:bg-white/10"}
                whitespace-nowrap`
              }
            >
              <span className="relative z-10 flex items-center gap-2">
                {item.icon && (
                  <span className="nav-icon text-lg">{item.icon}</span>
                )}
                {item.name}
              </span>
              {!isActiveRoute(item.href) && !item.last && !item.secondLast && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              )}
            </NavLink>
          ))}

          {user && (
            <button
              onClick={handleLogout}
              className="logout-btn-wrapper group relative flex items-center justify-center px-4 py-2 ml-2 bg-gradient-to-r from-primary to-primary-dark rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>

              <span className="logout-icon flex items-center justify-center mr-2">
                <ArrowRightOnRectangleIcon className="w-4 h-4 text-white" />
              </span>

              <span className="logout-text text-sm font-bold text-white whitespace-nowrap">
                Logout
              </span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button - Visible only on Mobile */}
        <div className="flex lg:hidden z-10">
          <button
            type="button"
            className="mobile-menu-button -m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-white hover:bg-white/10 transition-all duration-300"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open main menu"
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Completely Separate for Mobile */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />

        <Dialog.Panel className="mobile-menu-panel fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
          {/* Mobile Header */}
          <div className="mobile-header sticky top-0 z-10 flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary-dark text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <img className="h-5 w-auto" src={WhiteLogo} alt={companyName} />
              </div>
              <span className="font-semibold text-sm">{companyName}</span>
            </div>
            <button
              type="button"
              className="close-button -m-2.5 rounded-lg p-2.5 text-white hover:bg-white/20 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Mobile Content */}
          <div className="pb-20">
            {/* User Info - Simplified for Mobile */}
            {user && (
              <div className="user-mobile-section p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="user-avatar w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center text-lg font-bold shadow-md">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <div className="font-bold text-primary-dark text-sm">
                      {user.totalDonations || 0}
                    </div>
                    <div className="text-[10px] text-gray-500">Donations</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-primary-dark text-sm">
                      {(user.totalDonations || 0) * 3}
                    </div>
                    <div className="text-[10px] text-gray-500">Lives Saved</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links - Mobile Optimized */}
            <div className="p-3">
              <div className="space-y-1">
                {mobileNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      mobile-nav-item flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                      ${
                        isActive
                          ? "mobile-nav-item-active bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span className="nav-icon text-xl w-6 text-center">
                      {item.icon || <UserCircleIcon className="w-5 h-5" />}
                    </span>
                    <span className="flex-1 text-sm">{item.name}</span>
                    {item.highlight && (
                      <span className="highlight-badge px-2 py-0.5 bg-primary text-white text-[10px] rounded-full">
                        Hot
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* User Actions */}
              {user && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <NavLink
                    to="/donation-history"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-nav-item flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    <HeartIcon className="w-5 h-5" />
                    <span className="text-sm">Donation History</span>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="mobile-nav-item w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 mt-1"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}

              {/* Auth Buttons */}
              {!user && (
                <div className="mt-4 space-y-2">
                  <NavLink
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full bg-primary text-white py-3 rounded-xl font-medium text-sm text-center hover:bg-primary-dark transition-colors"
                  >
                    Join as Donor
                  </NavLink>
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full border border-primary text-primary py-3 rounded-xl font-medium text-sm text-center hover:bg-primary/5 transition-colors"
                  >
                    Login
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Footer - Fixed at Bottom */}
          <div className="mobile-footer fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100">
            <div className="emergency-section text-center">
              <div className="text-[10px] font-semibold text-gray-500 mb-1">
                Emergency
              </div>
              <div className="text-xl font-bold text-red-600">108</div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default HeaderComponent;
