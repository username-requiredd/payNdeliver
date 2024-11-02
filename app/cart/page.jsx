"use client";
import CartEmpty from "@/components/cartempty";
import CartSkeleton from "@/components/loaders/cartskeleton";
import Header from "@/components/header";
import { useCart } from "@/contex/cartcontex";
import CartItem from "@/components/shoppingCart";
import Link from "next/link";
import Footer from "@/components/footer";
const CartPage = () => {
  const { cart, removeFromCart, loading, error } = useCart();
  console.log("cart", cart);
  const totalPrice = cart.reduce((sum, { price, quantity }) => {
    return sum + price * quantity;
  }, 0);

  // if (error)
  //   return (
  //     <div className="">
  //       <Header />
  //       {/* <p className="text-red-600 mt-5 p-2">{error}</p>; */}
  //     </div>
  //   );

  return (
    <>
      <div className="mb-4">
        <Header />
        <div className="container mx-auto  px-2 py-8">
          <h1 className="font-semibold text-lg italic mb-6">Your Cart</h1>
          <div className="flex flex-col w-full justify-center  lg:flex-row gap-8">
            <div className="lg:w-1/2 w-full">
              {cart.length === 0 ? (
                <CartEmpty />
              ) : loading ? (
                <>
                  <CartSkeleton />
                  <CartSkeleton />
                </>
              ) : (
                cart.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    removeItem={removeFromCart}
                  />
                ))
              )}
            </div>
            <div
              className={`lg:w-1/3 border-2 bg-gray-100 p-6 rounded-lg h-fit ${
                cart.length === 0 || loading ? "hidden" : "block"
              }`}
            >
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
                  href={"/checkout"}
                  className="w-full p-2 bg-green-600 text-white py-2 rounded mt-6 hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
