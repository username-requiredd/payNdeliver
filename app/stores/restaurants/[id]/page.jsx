"use client";
import { Star, Phone, LocateIcon, Mail } from "lucide-react";
import FoodDetailsModal from "@/components/productdetails";
import ProductCard from "@/components/productscard";
import { useEffect, useState } from "react";
import Productscardskeleton from "@/components/loaders/productskeleton";
import { useCart } from "@/contex/cartcontex";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartContent from "./cartcontent";
import Reviews from "./reviews";
import BackToTopButton from "./backtotop";
import Header from "@/components/header";
import { useSession } from "next-auth/react";

const Restaurant = ({ params }) => {
  const { id } = params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState("All");
  const { addToCart, saveCartToDatabase } = useCart();
  const [products, setProducts] = useState([]);
  const { data: session } = useSession();
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchBusinessAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const businessResponse = await fetch(`/api/business/${id}`, { signal });
        if (!businessResponse.ok) {
          throw new Error("Error fetching business profile");
        }
        const businessData = await businessResponse.json();
        setProfile(businessData.data);

        if (businessData.data?._id) {
          const productsResponse = await fetch(
            `/api/products/${businessData.data._id}`,
            { signal }
          );
          if (!productsResponse.ok) {
            throw new Error("Error fetching products");
          }
          const productsData = await productsResponse.json();
          setProducts(productsData.data);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("An error occurred while fetching data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessAndProducts();

    return () => abortController.abort();
  }, [id, session?.user?.id]);

  const [det, setDet] = useState({
    title: "",
    price: "",
    dsc: "",
    image: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const details = (e) => {
    const m = products.find((prod) => e === prod._id);
    if (m) {
      setDet({
        id: m._id,
        title: m.name,
        image: m.image,
        dsc: m.description,
        price: m.price,
      });
      setIsModalOpen(true);
    }
  };

  const handleDishes = (e) => {
    setCat(e);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Added item to cart");
  };

  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  return (
    <>
      <div className="mb-4">
        <Header />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <FoodDetailsModal
            id={det.id}
            title={det.title}
            price={det.price}
            image={det.image}
            addToCart={handleAddToCart}
            dsc={det.dsc}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}

      <div className="container mx-auto max-w-screen-xl border p-4">
        <div className="lg:flex gap-8">
          <div className="w-full lg:w-3/4">
            {/* Hero Section */}
            <div className="relative h-80 mb-6 rounded-xl overflow-hidden">
              {loading ? (
                <div className="h-full w-full bg-gray-300 animate-pulse flex items-center justify-center">
                  <div className="w-20 h-20"></div>
                </div>
              ) : (
                <img
                  src={profile?.image}
                  className="w-full h-full object-cover"
                  alt={profile?.name}
                />
              )}
            </div>

            {/* Restaurant Info */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {loading ? (
                  <div className="h-8 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                ) : (
                  <h1 className="text-3xl font-bold">{profile?.name}</h1>
                )}
                {loading ? (
                  <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
                ) : (
                  <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                    <Star className="text-yellow-500 mr-1" fontSize="small" />
                    <span className="font-medium">4.5</span>
                    <span className="text-sm text-gray-600 ml-1">(5)</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-6">
                <div>
                  <p className="font-semibold text-gray-800">Opening time</p>
                  <p>{"9:00am-12:00am"}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Cuisine</p>
                  <p className="text-green-600">African</p>
                </div>
              </div>
            </div>

            {/* Menu Section */}
            <div className="mb-12">
  <h2 className="text-2xl font-bold mb-4">Our Menu</h2>
  <div className="flex space-x-2 overflow-x-auto pb-4 mb-6">
    {loading ? (
      Array(6)
        .fill()
        .map((_, index) => (
          <div
            key={index}
            className="h-10 w-20 bg-gray-300 rounded-full animate-pulse flex-shrink-0"
          ></div>
        ))
    ) : (
      <>
        <button
          key="all"
          onClick={() => setCat("All")}
          className={`px-4 py-2 rounded-full flex-shrink-0 transition duration-300 ${
            cat === "All"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        {profile?.cuisineType?.map((item) => (
          <button
            key={item}
            onClick={() => handleDishes(item)}
            className={`px-4 py-2 rounded-full flex-shrink-0 transition duration-300 ${
              item === cat
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {item}
          </button>
        ))}
      </>
    )}
  </div>

  <div className="grid md:grid-cols-2 gap-6">
    {loading
      ? Array(4)
          .fill()
          .map((_, index) => <Productscardskeleton key={index} />)
      : products
          .filter(
            (product) =>
              cat === "All" || product.cuisineType === cat
          )
          .map(({ name, description, image, _id, price }) => (
            <ProductCard
              key={_id}
              id={_id}
              image={image}
              title={name}
              dsc={description}
              price={price}
              onclick={() => details(_id)}
            />
          ))}
              </div>
        </div>

            {/* Customer Reviews Section */}
            <div className="mb-12">
              {profile ? <Reviews businessId={profile?._id} /> : null}
            </div>

            {/* Opening Hours and Contact Info */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Opening Hours</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                  {loading
                    ? Array(7)
                        .fill()
                        .map((_, index) => (
                          <div
                            key={index}
                            className="flex justify-between mb-2"
                          >
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                          </div>
                        ))
                    : profile?.openingHours?.map((item, index) => (
                        <div key={index} className="flex justify-between mb-2">
                          <span>{item.day}</span>
                          <span>
                            {item.open} - {item.close}
                          </span>
                        </div>
                      ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                  {loading ? (
                    Array(3)
                      .fill()
                      .map((_, index) => (
                        <div key={index} className="flex items-center mb-3">
                          <div className="h-6 w-6 bg-gray-300 rounded-full mr-3"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                      ))
                  ) : (
                    <>
                      <div className="flex items-center mb-3">
                        <LocateIcon className="text-green-600 mr-3" size={20} />
                        <p>{`${profile?.address?.street}, ${profile?.address?.state}, ${profile?.address?.country}`}</p>
                      </div>
                      <div className="flex items-center mb-3">
                        <Phone className="text-green-600 mr-3" size={20} />
                        <span>{profile?.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="text-green-600 mr-3" size={20} />
                        <span>{profile?.email}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="hidden lg:block border-l lg:w-1/4">
            <div className="sticky top-4 bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Your Cart</h2>
              <CartContent />
            </div>
          </div>
        </div>
      </div>
      <BackToTopButton />
    </>
  );
};

export default Restaurant;