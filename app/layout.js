import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "PayNdeliver",
  description: "landing page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className=" text-white border shadow-sm bg-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">PayNDeliver</h3>
              <p>Revolutionizing the delivery industry</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['About', 'Contact', 'Blog', 'Careers'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-green-400 transition-colors duration-300">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-green-400 transition-colors duration-300">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((item) => (
                  <a key={item} href="#" className="hover:text-green-400 transition-colors duration-300">{item}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
            © {new Date().getFullYear()} PayNDeliver. All rights reserved.
          </div>
        </div>
      </footer>

      </body>
    </html>
  );
}
