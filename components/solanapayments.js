"use client";
import { useState } from "react";
import PaymentRequest from "@/components/solanapayments";
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
export default function CheckoutPage() {
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [reference, setReference] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const checkPaymentStatus = async () => {
    if (!reference) {
      // console.error("No reference available");
      return;
    }
    setIsLoading(true);
    try {
      // Call your API endpoint to check the transaction status
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: reference }),
      });
      const data = await response.json();
      setPaymentStatus(data.message);
    } catch (error) {
      // console.error("Error checking payment status:", error);
      setPaymentStatus("error");
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "completed":
        return <CheckCircle className="text-green-500" size={24} />;
      case "failed":
        return <XCircle className="text-red-500" size={24} />;
      case "pending":
        return <Clock className="text-yellow-500" size={24} />;
      default:
        return null;
    }
  };
  const getStatusColor = () => {
    switch (paymentStatus) {
      case "completed":
        return "text-green-700 bg-green-100";
      case "failed":
        return "text-red-700 bg-red-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Checkout
      </h1>
      <div className="mb-8">
        <PaymentRequest onReferenceGenerated={setReference} />
      </div>
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={checkPaymentStatus}
          disabled={isLoading || !reference}
          className={`flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 ${
            isLoading || !reference
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {isLoading ? (
            <RefreshCw className="animate-spin mr-2" size={20} />
          ) : (
            <RefreshCw className="mr-2" size={20} />
          )}
          Check Payment Status
        </button>
        <div
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor()}`}
        >
          {getStatusIcon()}
          <span className="font-medium">Payment Status: {paymentStatus}</span>
        </div>
        {reference && (
          <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            Transaction Reference: {reference.substring(0, 8)}...
          </div>
        )}
      </div>
    </div>
  );
}
