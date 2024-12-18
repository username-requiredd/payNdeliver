"use client";

import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/contex/cartcontex";
import CartItem from "./cartitem";
import CartEmpty from "@/components/cartempty";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

// Currency formatting function
const formatCurrency = (amount, locale = "en-US", currency = "NGN") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const CartContent = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [hasMounted, setHasMounted] = useState(false);

  console.log("cart:", cart);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Calculate total price with formatting
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  if (!hasMounted) {
    return null; // Avoids hydration errors by not rendering anything until mounted
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
        ))}
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          {/* Format total with currency symbol */}
          <span className="font-bold text-green-600">
            {formatCurrency(total, "en-NG", "NGN")}
          </span>
        </div>
        <div className="space-y-2">
          <button
            onClick={clearCart}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300"
          >
            Clear Cart
          </button>
          <Link
            href="/checkout"
            className="block w-full bg-green-600 text-white py-2 px-4 rounded-full text-center hover:bg-green-700 transition duration-300"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
