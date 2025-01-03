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
    <html lang="en" suppressHydrationWarning>
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
