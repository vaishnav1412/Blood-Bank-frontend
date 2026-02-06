import { NavLink } from "react-router-dom";
import "./footer-component.scss"

const FooterComponent = () => {
  const exploreLinks = [
    { title: "Home", link: "/" },
    { title: "Donate Blood", link: "/donate-blood" },
    { title: "Request Blood", link: "/need-blood" },
    { title: "Donate Money", link: "https://donorbox.org/donate-money-11" },
    { title: "Host Blood Drive", link: "/host-blood-drive" },
    { title: "Contact", link: "/contact" },
    { title: "Admin Dashboard", link: "/admin" },
  ];

  const contactLinks = [
    { title: "(+91)-984-636-7283", link: "tel:+919846367283" },
    { title: "help@lifecode.com", link: "mailto:help@lifecode.com" },
    {
      title: "Kannur, Kerala",
      link: "https://maps.app.goo.gl/nkFzn61B9uQJX9ga9",
    },
    { title: "Open 24/7", link: "/contact" },
  ];

  return (
    <footer className="w-full  footer_bg text-white pt-16 pb-10 px-4">
      <div className="max-w-[1250px] mx-auto">
        {/* Top Section */}
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <h2 className="font-bold text-4xl leading-tight">
              LIFE
              <span className="text-blood ml-2">CODE</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-light">
              You don&apos;t have to be a doctor to save a life — just donate
              blood.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 text-sm tracking-[0.25em] uppercase text-blood">
              Explore
            </h3>
            <ul className="space-y-2">
              {exploreLinks.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.link}
                    className="text-lg text-neutral-light hover:text-white transition"
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm tracking-[0.25em] uppercase text-blood">
              Contact
            </h3>
            <ul className="space-y-2">
              {contactLinks.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.link}
                    className="text-lg text-neutral-light hover:text-white transition"
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/20 pt-6 text-center">
          <p className="text-neutral-light text-lg">
            © 2023 Life Code — Website design by{" "}
            <a
              href="https://www.linkedin.com/in/vaishnav-v-m-140a91262/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition"
            >
              Vaishnav V M
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
