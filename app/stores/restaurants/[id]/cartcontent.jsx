"use client"
import CartItem from "./cartitem";
import { useState, useEffect } from "react";
import { useCart } from "@/contex/cartcontex";
// import { useCart } from "../../../contex/cartcontex";
import CartEmpty from "@/components/cartempty";
const CartContent = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [total, setTotal] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cart]);

  if (!hasMounted) {
    return null; // Avoids hydration errors by not rendering anything until mounted
  }

  if (cart.length === 0) {
    return <CartEmpty/>
  }

  return (
    <div>
      <div className="space-y-4 mb-4">
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
          <span className="font-bold text-green-600">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={clearCart}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300"
        >
          Clear Cart
        </button>
        <button
          className="w-full mt-2 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition duration-300"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartContent;
