import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { WalletContextProvider } from "@/components/walletprovider";
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
<<<<<<< HEAD
    <html lang="en">
=======
    <html lang="en" suppressHydrationWarning>
>>>>>>> 25f7da75e12b50a3bd435ec880d26765d2874b64
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <WalletContextProvider>
            {children}
            {/* <Footer /> */}
          </WalletContextProvider>
        </Providers>
      </body>
    </html>
  );
}
