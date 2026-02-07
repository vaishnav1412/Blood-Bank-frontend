import { useState, useEffect } from "react";
import "./hedder-component.scss";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate, NavLink } from "react-router-dom";
import getData from "../../utility-functions/fetch-data-doner";
import BlackLogo from "../../../../public/HemoCell Logo black.png";
import WhiteLogo from "../../../../public/Gemini_Generated_Image_twae1mtwae1mtwae-removebg-preview.png";

const compnayName = "Kannur Blood Link";

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
      : { name: "Doner Login", href: "/donate-blood", last: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/donate-blood"); // or navigate if using useNavigate
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
      onScroll={() => setBlurActivation(true)}
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/[.2]  ${
        blurActivation
          ? "bg-dark/[.7] backdrop-blur-md transition duration-1000"
          : ""
      }`}
    >
      <nav
        className="flex  items-center justify-between p-6 lg:px-8 w-[min(1250px,100%-15px)] m-auto"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1 ">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">{compnayName}</span>
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

        {/* Desktop navigation */}

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
            <button className="Btn" onClick={handleLogout}>
              <div className="sign">
                <svg viewBox="0 0 512 512">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
              </div>

              <div className="text">Logout</div>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full px-6 py-6 overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">{compnayName}</span>
              <img className="w-auto h-12" src={BlackLogo} alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flow-root mt-6">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="py-6 space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    onClick={() => {
                      setIsActiveName(item.name);
                      setMobileMenuOpen(false);
                    }}
                    to={item.href}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-dark px-3 py-2 rounded-rsm ${
                      item.secondLast &&
                      `rounded-rsm border border-dark/[.5] hover:bg-white hover:text-dark`
                    } ${
                      item.last &&
                      `last:bg-red last:text-white last:hover:bg-white last:hover:text-dark`
                    } ${isActiveName == item.name ? `bg-dark text-white` : ``}`}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default HeaderComponent;
