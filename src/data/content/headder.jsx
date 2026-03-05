export const getNavigation = (user) => [
  { name: "Home", href: user ? "/home" : "/" },

  { name: "Host Blood Drive", href: "/host-blood-drive" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact Us", href: user ? "/contact-private" :"/contact", icon: "📞" },
  { name: "Need Blood", href: "/need-blood", secondLast: true },

  user
    ? {
        name:
          user.name && user.name.length > 12
            ? user.name.slice(0, 10) + "..."
            : user.name || "Profile",
        href: "/donor-profile",
        last: true,
      }
    : {
        name: "Doner Login",
        href: "/login",
        last: true,
      },
];

export const getMobileNavigation = (user) => [
  {
    name: "Home",
    href: user ? "/home" : "/",   // ✅ Conditional Home
    icon: "🏠",
  },

  { name: "Host Blood Drive", href: "/host-blood-drive", icon: "🏥" },
  { name: "Gallery", href: "/gallery", icon: "📸" },
  { name: "Contact Us", href: user ? "/contact-private" :"/contact", icon: "📞" },
  { name: "Need Blood", href: "/need-blood", icon: "🩸", highlight: true },

  user
    ? {
        name: user.name?.split(" ")[0] || "Profile",
        href: "/donor-profile",
        icon: "👤",
        last: true,
      }
    : {
        name: "Doner Login",
        href: "/login",
        icon: "🔑",
        last: true,
      },
];

