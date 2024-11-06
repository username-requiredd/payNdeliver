"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  createQR,
  encodeURL,
  findReference,
  validateTransfer,
  FindReferenceError,
  ValidateTransferError,
} from "@solana/pay";
import { PublicKey, Keypair, Connection, clusterApiUrl } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { CreditCard, Coins, Truck, QrCode, Wallet } from "lucide-react";
// import { useCart } from "@/context/cartcontext";
import { useCart } from "@/contex/cartcontex";
import { useSession } from "next-auth/react";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function EnhancedCheckout() {
  const { cart } = useCart();
  const { data: session } = useSession();
  const [wallet] = useState("a8xbmjRKktM4Np8M2RS6a3nrygQq7aaguNe9n7JFfjE");

  // Calculate total cost from cart
  const totalCost = cart.reduce((accumulator, { price, quantity }) => {
    return accumulator + price * quantity;
  }, 0);

  // Get cart items
  const cartItems = cart.map(({ name }) => name).join(" ");

  const [reference, setReference] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("crypto");
  const [cryptoPaymentType, setCryptoPaymentType] = useState("qr");
  const [walletAddress, setWalletAddress] = useState("");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  });
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [paymentStatus, setPaymentStatus] = useState("");
  const qrRef = useRef(null);

  // Solana connection
  const connection = new Connection(clusterApiUrl("devnet"));

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCart = async () => {
      try {
        const id = session?.user?.id;
        if (!id) return;

        const url = `/api/cart/${id}`;
        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error("Error fetching cart data!");
        }

        const cartData = await response.json();
        console.log(cartData.data);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error(err);
        }
      }
    };

    fetchCart();

    return () => {
      controller.abort();
    };
  }, [session]);

  useEffect(() => {
    if (!totalCost || !cartItems) return; // Add validation

    const newReference = Keypair.generate().publicKey;
    setReference(newReference);

    const recipient = new PublicKey(wallet);
    const amount = new BigNumber(totalCost);
    const memo = cartItems;

    const url = encodeURL({ recipient, amount, reference: newReference, memo });
    const qr = createQR(url);

    if (
      qrRef.current &&
      paymentMethod === "crypto" &&
      cryptoPaymentType === "qr"
    ) {
      qrRef.current.innerHTML = "";
      qr.append(qrRef.current);
    }
  }, [paymentMethod, cryptoPaymentType, totalCost, cartItems, wallet]);

  const handleInputChange = (e, setFunction) => {
    const { name, value } = e.target;
    setFunction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) {
      setPaymentStatus("Error: Cart is empty");
      return;
    }

    if (paymentMethod === "crypto" && cryptoPaymentType === "wallet") {
      await handleSolanaPayment();
    } else {
      console.log("Payment submitted:", {
        paymentMethod,
        cryptoPaymentType,
        walletAddress,
        cardDetails,
        shippingDetails,
      });
    }
  };

  const handleSolanaPayment = async () => {
    setPaymentStatus("Processing...");

    try {
      const recipientAddress = new PublicKey(walletAddress);
      const recipient = new PublicKey(wallet);
      const amount = new BigNumber(totalCost);
      const memo = cartItems;
      const url = encodeURL({ recipient, amount, reference, memo });

      console.log("Payment URL:", url.toString());
      setPaymentStatus("Waiting for transaction...");

      const signatureInfo = await findReference(connection, reference, {
        finality: "confirmed",
      });

      await validateTransfer(
        connection,
        signatureInfo.signature,
        {
          recipient,
          amount,
          reference,
          memo,
        },
        { commitment: "confirmed" }
      );

      setPaymentStatus("Payment successful!");
    } catch (error) {
      console.error("Error processing Solana payment:", error);
      if (error instanceof FindReferenceError) {
        setPaymentStatus("Payment not found. Please try again.");
      } else if (error instanceof ValidateTransferError) {
        setPaymentStatus("Payment failed. Please try again.");
      } else {
        setPaymentStatus("An error occurred. Please try again.");
      }
    }
  };

  const inputClasses =
    "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 px-4 py-2 bg-white transition duration-300 ease-in-out";

  return (
    <>
      <Header />
      <div className="bg-gray-100">
        <div className="max-w-6xl mx-auto pt-10 p-4 sm:p-6 lg:p-8 ">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 sm:mb-12 text-center text-green-800 tracking-tight animate-fade-in-down">
            Secure Checkout
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl  transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-green-700 flex items-center">
                <Truck className="mr-3" size={28} />
                Shipping Information
              </h2>
              <form className="space-y-6">
                {Object.entries(shippingDetails).map(([key, value]) => (
                  <div key={key} className="animate-fade-in">
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-700 capitalize mb-2"
                    >
                      {key}
                    </label>
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={value}
                      onChange={(e) => handleInputChange(e, setShippingDetails)}
                      className={`${inputClasses} transform hover:scale-105`}
                      required
                    />
                  </div>
                ))}
              </form>
            </div>

            <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-green-700">
                Payment Method
              </h2>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <button
                  onClick={() => setPaymentMethod("crypto")}
                  className={`flex items-center justify-center px-6 sm:px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
                    paymentMethod === "crypto"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white text-green-600 border-2 border-green-600 hover:bg-green-50"
                  }`}
                >
                  <Coins className="mr-3" size={24} />
                  Pay with Crypto
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-center px-6 sm:px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
                    paymentMethod === "card"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white text-green-600 border-2 border-green-600 hover:bg-green-50"
                  }`}
                >
                  <CreditCard className="mr-3" size={24} />
                  Pay with Card
                </button>
              </div>

              {paymentMethod === "crypto" && (
                <div className="mb-6">
                  <div className="flex justify-center space-x-4 mb-4">
                    <button
                      onClick={() => setCryptoPaymentType("qr")}
                      className={`flex items-center justify-center px-4 py-2 rounded-full transition-all duration-300 ${
                        cryptoPaymentType === "qr"
                          ? "bg-green-600 text-white shadow-md"
                          : "bg-white text-green-600 border border-green-600 hover:bg-green-50"
                      }`}
                    >
                      <QrCode className="mr-2" size={20} />
                      Scan QR
                    </button>
                    <button
                      onClick={() => setCryptoPaymentType("wallet")}
                      className={`flex items-center justify-center px-4 py-2 rounded-full transition-all duration-300 ${
                        cryptoPaymentType === "wallet"
                          ? "bg-green-600 text-white shadow-md"
                          : "bg-white text-green-600 border border-green-600 hover:bg-green-50"
                      }`}
                    >
                      <Wallet className="mr-2" size={20} />
                      Enter Wallet
                    </button>
                    {cryptoPaymentType === "wallet" && (
                      <SolanaPayment
                        amount={totalCost}
                        recipientAddress="your-shop-wallet-address"
                        onSuccess={(signature) => {
                          setPaymentStatus("Payment successful!");
                          // Handle successful payment (e.g., clear cart, redirect to success page)
                        }}
                        onError={(error) => {
                          setPaymentStatus("Payment failed. Please try again.");
                          // Handle payment error
                        }}
                      />
                    )}
                  </div>

                  {cryptoPaymentType === "qr" ? (
                    <div className="text-center bg-gray-50 p-6 sm:p-8 rounded-xl shadow-inner transition-all duration-300 animate-fade-in">
                      <div
                        ref={qrRef}
                        className="inline-block transform hover:scale-105 transition-transform duration-300"
                      />
                      {reference && (
                        <p className="mt-6 text-sm text-gray-600 animate-fade-in">
                          Reference: {reference.toBase58().substring(0, 8)}...
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <label
                        htmlFor="walletAddress"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Wallet Address
                      </label>
                      <input
                        type="text"
                        id="walletAddress"
                        name="walletAddress"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className={`${inputClasses} transform hover:scale-105`}
                        placeholder="Enter your Solana wallet address"
                        required
                      />
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === "card" && (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 animate-fade-in"
                >
                  {Object.entries(cardDetails).map(([key, value]) => (
                    <div key={key}>
                      <label
                        htmlFor={key}
                        className="block text-sm font-medium text-gray-700 capitalize mb-2"
                      >
                        {key === "number" ? "Card Number" : key}
                      </label>
                      <input
                        type={
                          key === "number"
                            ? "text"
                            : key === "expiry"
                            ? "text"
                            : key === "cvc"
                            ? "password"
                            : "text"
                        }
                        id={key}
                        name={key}
                        value={value}
                        onChange={(e) => handleInputChange(e, setCardDetails)}
                        className={`${inputClasses} transform hover:scale-105`}
                        required
                        placeholder={key === "expiry" ? "MM/YY" : ""}
                      />
                    </div>
                  ))}
                </form>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-12 w-full py-5 px-8 border border-transparent rounded-md shadow-xl text-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 "
          >
            Complete Purchase
          </button>

          {paymentStatus && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                paymentStatus.includes("successful")
                  ? "bg-green-100 text-green-800"
                  : paymentStatus.includes("Processing")
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {paymentStatus}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
