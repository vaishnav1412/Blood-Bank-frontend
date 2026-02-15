import { NavLink } from "react-router-dom";
import "./footer-component.scss";

const FooterComponent = () => {
  const exploreLinks = [
    { title: "Home", link: "/" },
    { title: "Donate Blood", link: "/donate-blood" },
    { title: "Need Blood", link: "/need-blood" },
    { title: "Become a Donor", link: "/register" },
    { title: "Host Blood Drive", link: "/host-blood-drive" },
    { title: "Gallery", link: "/gallery" },
    { title: "Contact Us", link: "/contact" },
  ];

  const contactLinks = [
    { title: "(+91) 98463 67283", link: "tel:+919846367283" },
    { title: "kannurbloodlink@gmail.com", link: "mailto:kannurbloodlink@gmail.com" },
    {
      title: "Kannur, Kerala, India",
      link: "https://maps.app.goo.gl/nkFzn61B9uQJX9ga9",
    },
    { title: "Available 24/7 for Emergencies", link: "/contact" },
  ];

  return (
    <footer className="w-full footer_bg text-white pt-16 pb-10 px-4">
      <div className="max-w-[1250px] mx-auto">
        {/* Top Section */}
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          
          {/* Brand */}
          <div>
            <h2 className="font-bold text-4xl leading-tight">
              Kannur
              <span className="text-blood ml-2">Blood Link</span>
            </h2>

            <p className="mt-4 text-lg text-neutral-light">
              A community-driven blood donation platform connecting donors and
              patients across Kannur.  
              <span className="block mt-2">
                ❤️ One donation can save up to 3 lives.
              </span>
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
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-neutral-light hover:text-white transition"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/20 pt-6 text-center">
          <p className="text-neutral-light text-lg">
            © {new Date().getFullYear()} Kannur Blood Link — Built with ❤️ by{" "}
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
