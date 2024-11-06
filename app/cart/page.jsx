"use client";
import { useState, useEffect } from "react";
import CartEmpty from "@/components/cartempty";
import CartSkeleton from "@/components/loaders/cartskeleton";
import Header from "@/components/header";
import { useCart } from "@/contex/cartcontex";
import CartItem from "@/components/shoppingCart";
import Link from "next/link";
import Footer from "@/components/footer";

const CartPage = () => {
  const [mounted, setMounted] = useState(false);
  const { cart, removeFromCart, loading, error } = useCart();
  console.log("cart", cart);
  const c = cart?.map((item) => item);
  console.log("c", c);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === "undefined") {
    return (
      <>
        <Header />
        <div className="container mx-auto px-2 py-8">
          <CartSkeleton />
          <CartSkeleton />
        </div>
        <Footer />
      </>
    );
  }

  // Calculate total price safely
  const totalPrice =
    cart?.reduce((sum, { price, quantity }) => {
      return sum + (price || 0) * (quantity || 0);
    }, 0) || 0;

  // Handle error state
  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-2 py-8">
          <p className="text-red-600 mt-5 p-2">{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="mb-4">
        <Header />
        <div className="container mx-auto px-2 py-8">
          <h1 className="font-semibold text-lg italic mb-6">Your Cart</h1>
          <div className="flex flex-col w-full justify-center lg:flex-row gap-8">
            <div className="lg:w-1/2 w-full">
              {!cart?.length ? (
                <CartEmpty />
              ) : loading ? (
                <>
                  <CartSkeleton />
                  <CartSkeleton />
                </>
              ) : (
                cart &&
                cart?.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    removeItem={removeFromCart}
                  />
                ))
              )}
            </div>

            {cart?.length > 0 && !loading && (
              <div className="lg:w-1/3 border-2 bg-gray-100 p-6 rounded-lg h-fit">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping:</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-4">
                  <span>Total:</span>
                  <span>${(totalPrice + 5).toFixed(2)}</span>
                </div>
                <div className="mt-5">
                  <Link
                    href="/checkout"
                    className="block text-center w-full p-2 bg-green-600 text-white py-2 rounded mt-6 hover:bg-green-700 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
