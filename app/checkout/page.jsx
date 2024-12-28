"use client";
import OrderSuccessModal from "./ordersuccess";
import { useState, useEffect } from "react";
import { useCart } from "@/contex/cartcontex";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import createNotification from "./sendNotification";
import BigNumber from "bignumber.js";
import axios from "axios";
import { CreditCard, Coins, Truck, Calculator, Wallet } from "lucide-react";
import { formatCurrency } from "@/hooks/formatcurrency";
import { useEmailSender } from "@/hooks/useEmailSender";
const TAX_RATES = {
  CA: 0.0725,
  NY: 0.08875,
  TX: 0.0625,
};

const SHIPPING_RATES = {
  standard: { base: 500, perNaira: 500 },
  express: { base: 1000, perNaira: 500 },
};

const Checkout = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { data: session } = useSession();
  const { connected, publicKey, sendTransaction } = useWallet();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cryptoPaymentType, setCryptoPaymentType] = useState("wallet");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [merchantWallet] = useState(
    "GAQakNCAeoKLi5nacP95fUWkTt2BLXRuQSBY5hequ8NU"
  );

  const {
    sendEmail,
    loading: emailLoader,
    error,
    success,
  } = useEmailSender({
    // Optional configurations
    retryCount: 3,
    onSuccess: () => {
      // Clear form on success
      setFormData({ email: "", subject: "", message: "" });
    },
  });

  const [shippingDetails, setShippingDetails] = useState(() => {
    if (typeof window !== "undefined") {
      const savedDetails = localStorage.getItem("shippingDetails");
      return savedDetails
        ? JSON.parse(savedDetails)
        : {
            name: "",
            email: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            phone: "",
          };
    }
    return {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    };
  });

  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  console.log("cart", cart);
  // retrieve shipping details form localstorage
  useEffect(() => {
    localStorage.setItem("shippingDetails", JSON.stringify(shippingDetails));
  }, [shippingDetails]);

  useEffect(() => {
    if (session?.user) {
      setShippingDetails((prev) => ({
        ...prev,
        email: session.user.email || prev.email,
        name: session.user.name || prev.name,
      }));
    }
  }, [session]);
  // calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce(
      (total, { price, quantity }) => total + price * quantity,
      0
    );
  };
  // calculate shipping
  const calculateShipping = () => {
    const rate = SHIPPING_RATES[shippingMethod];
    const totalWeight = cart.reduce(
      (weight, item) => weight + (item.weight || 0.5) * item.quantity,
      0
    );
    return rate.base + totalWeight * rate.perNaira;
  };

  const calculateTax = (subtotal) => {
    const taxRate = TAX_RATES[shippingDetails.state] || 0.06;
    return subtotal * taxRate;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const tax = calculateTax(subtotal);
    return subtotal + shipping + tax;
  };

  // function to get real time sol price
  const getSolPrice = async () => {
    try {
      // Fetch current Solana price in USD
      const solPriceResponse = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const solPriceUSD = solPriceResponse.data.solana.usd;

      // Fetch current USD to Naira
      const exchangeRateResponse = await axios.get(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      const nairaRate = exchangeRateResponse.data.rates.NGN;

      // Calculate Sol price in Naira
      const solPriceNaira = solPriceUSD * nairaRate;

      return solPriceNaira;
    } catch (error) {
      console.error("Failed to fetch Solana price in Naira:", error);
      // Fallback price if API fails
      return 100 * 1200; // Example fallback: $100 * ~1200 Naira per USD
    }
  };

  const createTransaction = async (
    publicKey,
    recipientPublicKey,
    amountInSol
  ) => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      // Round to 9 decimal places and convert to lamports
      const lamports = Math.floor(amountInSol * LAMPORTS_PER_SOL);

      // Create a transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: lamports,
        })
      );

      // Get recent blockhash
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      transaction.feePayer = publicKey;

      // Send and confirm transaction
      const signature = await sendTransaction(transaction, connection);

      return signature; // Return the signature
    } catch (error) {
      console.error("Transaction creation failed:", error);
      throw new Error(`Solana transaction failed: ${error.message}`);
    }
  };
  // function to update the order status
  const updateOrderStatus = async (orderId, updateData) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}`, updateData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (response.status !== 200) {
        throw new Error(`Order update failed with status: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.error("Order update error:", error);

      // Distinguish between network errors and server errors
      if (error.response) {
        // The request was made and the server responded with a status code
        throw new Error(
          `Order update server error: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error(
          "No response received from server. Check your network connection."
        );
      } else {
        // Something happened in setting up the request
        throw new Error(`Order update error: ${error.message}`);
      }
    }
  };

  // form validations
  const validateForms = () => {
    const requiredShippingFields = [
      "name",
      "email",
      "address",
      "city",
      "state",
      "zip",
    ];
    const isShippingValid = requiredShippingFields.every(
      (field) => shippingDetails[field] && shippingDetails[field].trim() !== ""
    );

    if (!isShippingValid) {
      setPaymentStatus("Please fill in all shipping details");
      return false;
    }

    if (paymentMethod === "card") {
      const requiredCardFields = ["number", "name", "expiry", "cvc"];
      const isCardValid = requiredCardFields.every(
        (field) => cardDetails[field] && cardDetails[field].trim() !== ""
      );

      if (!isCardValid) {
        setPaymentStatus("Please fill in all card details");
        return false;
      }
    }

    return true;
  };
  // function to create order after sucessful payments
  const createOrder = async (paymentInfo) => {
    try {
      const orderData = {
        customerId: session?.user?.id,
        items: cart.map((item) => ({
          productId: item.id,
          productImage: item.image,
          productName: item.name,
          storeName: item.storeName,
          businessId: item.storeId,
          businessEmail: item.storeEmail,
          productDescription: item.description,
          quantity: item.quantity,
          unitPriceUSD: item.price,
          subtotalUSD: item.price * item.quantity,
        })),
        totalAmountUSD: calculateTotal(),
        delivery: {
          name: shippingDetails.name,
          email: shippingDetails.email,
          address: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          zip: shippingDetails.zip,
          phone: shippingDetails.phone,
        },
        status: "pending",
        payment: {
          ...paymentInfo,
          amountUSD: calculateTotal(),
        },
      };
      const response = await axios.post("/api/orders", orderData);

      // Extract the order ID
      const orderId = response.data.orderId || response.data.data._id;
      console.log(orderId);
      return orderId; // Return the order ID
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  };
  //  function to handle card payment
  const handleCardPayment = async () => {
    try {
      setLoading(true);
      setPaymentStatus("Processing payment...");

      if (!validateForms())
        throw new Error("Please fill in all required fields");

      const orderId = await createOrder({
        type: "card",
        last4: cardDetails.number.slice(-4),
      });

      // Make the put request to update the order
      await axios.put(`/api/orders/${orderId}`, {
        status: "paid",
        paymentDetails: {
          type: "card",
          last4: cardDetails.number.slice(-4),
        },
      });

      await handleSuccessfulPayment(orderId);
    } catch (error) {
      setPaymentStatus(`Payment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoPayment = async () => {
    try {
      setLoading(true);
      setPaymentStatus("Processing payment...");

      if (!validateForms())
        throw new Error("Please fill in all required fields");

      if (!connected || !publicKey) {
        throw new Error("Please connect your wallet first");
      }

      const solPrice = await getSolPrice();
      const totalUSD = calculateTotal();
      const amountInSol = new BigNumber(totalUSD).dividedBy(solPrice);

      const signature = await createTransaction(
        publicKey,
        new PublicKey(merchantWallet),
        amountInSol
      );

      const paymentDetails = {
        type: "crypto",
        wallet: publicKey?.toString(),
        cryptoAmount: amountInSol.toString(),
        transactionHash: signature,
      };

      // Create order first and get the orderId
      const orderId = await createOrder({
        ...paymentDetails,
        status: "paid",
      });

      // Update order status
      await updateOrderStatus(orderId, {
        status: "paid",
        payment: {
          type: "crypto",
          wallet: publicKey?.toString(),
          transactionHash: signature,
        },
      });

      // Send success email
      await sendEmail({
        to: session?.user?.email,
        subject: "Payment Successful - Order Confirmation",
        html: `
          <h1>Thank you for your payment!</h1>
          <p>Your order (${orderId}) has been successfully processed.</p>
          <p>Payment Details:</p>
          <ul>
            <li>Amount: ${amountInSol.toString()} SOL</li>
            <li>Transaction Hash: ${signature}</li>
            <li>Wallet: ${publicKey.toString()}</li>
          </ul>
          <p>You can track your order status using the order ID: ${orderId}</p>
        `,
      });

      // Ensure successful payment handling
      await handleSuccessfulPayment(orderId);
    } catch (error) {
      const message = {
        title: "Payment Failed",
        message: `Unfortunately, your payment for order could not be processed. Please try again or contact support for assistance.`,
        userId: session?.user?.id,
        type: "in-app",
      };
      createNotification(message);

      // Send failure email
      if (session?.user?.email) {
        await sendEmail({
          to: session.user.email,
          subject: "Payment Failed - Action Required",
          html: `
            <h1>Payment Failed</h1>
            <p>We noticed there was an issue processing your recent payment.</p>
            <p>Error Details: ${error.message}</p>
            <p>Please try the following:</p>
            <ul>
              <li>Check your wallet connection</li>
              <li>Ensure you have sufficient SOL balance</li>
              <li>Try the transaction again</li>
            </ul>
            <p>If you continue to experience issues, please contact our support team.</p>
          `,
        });
      }

      console.error("Crypto payment full error:", error);
      setPaymentStatus(`Payment failed: ${error.message}`);

      // Optional: Add more specific error handling
      if (error.message.includes("wallet")) {
        // Specific wallet connection error
        setPaymentStatus("Please connect your Solana wallet");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulPayment = async (orderId) => {
    try {
      console.log("Handling successful payment for order:", orderId);
      setPaymentStatus("Payment successful!");

      setOrderDetails({
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          image: item.image,
          name: item.name,
          price: item.price,
          subtotalUSD: item.price * item.quantity,
        })),
        orderId: orderId,
      });

      const newNotification = {
        title: "Payment Successful",
        message: `Your payment for order #${orderId} has been successfully processed.`,
        userId: session?.user?.id,
        status: "success",
        type: "in-app",
      };

      createNotification(newNotification);

      console.log("orderDetails: ", orderDetails);
      setIsOrderSuccessModalOpen(true);
    } catch (error) {
      console.error("Error in post-payment processing:", error);
      setPaymentStatus("Payment successful, but navigation failed");
    }
  };

  const onContinueShopping = () => {
    clearCart();
    router.push("/stores");
  };
  const onViewOrders = () => {
    clearCart();
    router.push("/profile");
  };

  return (
    <div className="checkout-container">
      {isOrderSuccessModalOpen && (
        <OrderSuccessModal
          onViewOrders={onViewOrders}
          orderDetails={orderDetails}
          onContinueShopping={onContinueShopping}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Truck size={24} />
                  Shipping Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(shippingDetails).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {key}
                      </label>
                      <input
                        type={key === "email" ? "email" : "text"}
                        value={value}
                        onChange={(e) =>
                          setShippingDetails((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Shipping Method Selection */}
                {/* <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Shipping Method</h3>
                <div className="space-y-2">
                  {Object.entries(SHIPPING_RATES).map(([method, rates]) => (
                    <label key={method} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method}
                        checked={shippingMethod === method}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="form-radio"
                      />
                      <span className="capitalize">{method}</span>
                      <span className="text-gray-500">
                        (${rates.base.toFixed(2)} + ${rates.perNaira}/lb)
                      </span>
                    </label>
                  ))}
                </div>
              </div> */}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CreditCard size={24} />
                  Payment Method
                </h2>
              </div>
              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                      paymentMethod === "card"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <CreditCard size={20} />
                    Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod("crypto")}
                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                      paymentMethod === "crypto"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <Coins size={20} />
                    Crypto
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    {Object.entries(cardDetails).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {key}
                        </label>
                        <input
                          type={key === "cvc" ? "password" : "text"}
                          value={value}
                          onChange={(e) =>
                            setCardDetails((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {paymentMethod === "crypto" && (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <button
                        onClick={() => setCryptoPaymentType("wallet")}
                        className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                          cryptoPaymentType === "wallet"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <Wallet size={20} />
                        Connect Wallet
                      </button>
                    </div>

                    {cryptoPaymentType === "wallet" && (
                      <div className="text-center">
                        <WalletMultiButton />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calculator size={24} />
                  Order Summary
                </h2>
              </div>
              <div className="p-6">
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          {formatCurrency(
                            item.price * item.quantity.toFixed(2),
                            "en-NG",
                            "NGN"
                          )}
                          {/* ${(item.price * item.quantity).toFixed(2)} */}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500">
                      Your cart is empty
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                {cart.length > 0 && (
                  <>
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>
                          {formatCurrency(
                            calculateSubtotal().toFixed(2),
                            "en-NG",
                            "NGN"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>
                          {formatCurrency(
                            calculateShipping().toFixed(2),
                            "en-NG",
                            "NGN"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        {/* <span className="text-gray-600">Tax</span>
                        <span>
                          {formatCurrency(5, "en-NG", "NGN")}
                          {calculateTax(calculateSubtotal()).toFixed(2)}
                        </span> */}
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>
                          {formatCurrency(
                            calculateTotal().toFixed(2),
                            "en-NG",
                            "NGN"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <button
                      onClick={
                        paymentMethod === "crypto"
                          ? handleCryptoPayment
                          : handleCardPayment
                      }
                      disabled={loading || !cart.length}
                      className="w-full mt-6 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Place Order"
                      )}
                    </button>

                    {/* Payment Status Message */}
                    {paymentStatus && (
                      <div
                        className={`mt-4 p-4 rounded-lg border ${
                          paymentStatus.includes("failed")
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-blue-50 border-blue-200 text-blue-700"
                        }`}
                      >
                        <p>{paymentStatus}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
