import React from "react";
import { formatCurrency } from "@/hooks/formatcurrency";
const OrderSummary = ({ cart, total }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md" */}
              {/* /> */}
              {/* <div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-500">Qty: {item.quantity}</p>
              </div> */}
            </div>
            <p className="text-lg font-medium">
              {formatCurrency(item.price * item.quantity, "en-NG", "NGN")}
              {/* ${(item.price * item.quantity).toFixed(2)} */}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-500">Total</p>
          {/* <p className="text-lg font-medium">${total.toFixed(2)}</p> */}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
