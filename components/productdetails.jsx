"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
const FoodDetailsModal = ({
  name,
  price,
  onClose,
  description,
  image,
  addToCart,
  saveCartToDatabase,
  id,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();
  const handleAddToCart = () => {
    if (!session) {
      router.push("/signin");
      return;
    }
    addToCart({
      name,
      price,
      description,
      image,
      id,
      quantity,
    });
  };
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-h_idden">
        <div className="relative h-64">
          <img src={image} alt={name} className="w-full h-full object-cover" />
          <div className="rounded-full" onClick={onClose}>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeW_idth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 ">{name}</h2>
          <p className=" text-gray-600 mb-6">{description}</p>

          <p className="text-xl text-green-600 font-semibold mb-6">${price}</p>

          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-medium">Quantity:</span>
            <div className="flex items-center">
              <button
                onClick={decreaseQuantity}
                className="text-gray-500 hover:text-gray-700"
              >
                <Minus />
              </button>
              <span className="mx-4 text-xl font-semibold">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="text-gray-500 hover:text-gray-700"
              >
                <Plus />
              </button>
            </div>
          </div>
          {/* <Link href={"/checkout"}> */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors"
          >
            Place Order - ${(price * quantity).toFixed(2)}
          </button>
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
};

export default FoodDetailsModal;
