import Link from "next/link";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import WhatsAppButton from "./whatsapplink";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Social Links */}
          <div className="space-y-6">
            <Link href="/?skipRedirect=true" className="flex-shrink-0">
              <img
                src="/images/logo/payNdeliver.svg"
                className="h-12 w-auto hover:scale-105 transition-transform duration-300"
                alt="Logo"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Bridging businesses to the future with crypto payments and
              efficient deliveries.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook size={20} />, href: "#" },
                {
                  icon: <Twitter size={20} />,
                  href: "https://x.com/payNdeliver?t=CYAF9NWU7Ftqrf7QtrcU4w&s=09",
                },
                { icon: <Linkedin size={20} />, href: "#" },
                { icon: <Instagram size={20} />, href: "#" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-300"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-400">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Get started", href: "/?skipRedirect=true" },
                { label: "Shop", href: "/stores" },
                { label: "Cart", href: "/cart" },
                { label: "Profile", href: "/profile" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:underline hover:translate-x-2 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-400">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-green-400" />
                <Link
                  href="mailto:info@payndeliver.com"
                  className="text-gray-300 hover:text-white hover:underline transition-colors duration-300"
                >
                  payndeliver1@gmail.com
                </Link>
              </li>
              <li className="flex items-center">
                <WhatsAppIcon
                  sx={{ fontSize: 16 }}
                  className="mr-2 text-green-400"
                />
                <Link
                  href={"https://wa.me/+2347061647972"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white hover:underline transition-colors duration-300"
                >
                  +(234) 7061647972
                </Link>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-green-400" />
                <span className="text-gray-300">
                  University of Maiduguri
                  <br />
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} PayNDeliver. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
