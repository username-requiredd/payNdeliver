"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/contex/cartcontex";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Star, Phone, LocateIcon, Mail } from "lucide-react";

import Header from "@/components/header";
import FoodDetailsModal from "@/components/productdetails";
import ProductCard from "@/components/productscard";
import Productscardskeleton from "@/components/loaders/productskeleton";
import CartContent from "./cartcontent";
import Reviews from "./reviews";
import BackToTopButton from "./backtotop";
import Footer from "@/components/footer";

const Restaurant = ({ params }) => {
  const { id } = params;
  const { data: session } = useSession();
  const { addToCart } = useCart();

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cat, setCat] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchBusinessAndProducts = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError(null);

        const businessResponse = await fetch(`/api/business/${id}`, { signal });
        if (!businessResponse.ok)
          throw new Error("Error fetching business profile");

        const businessData = await businessResponse.json();
        setProfile(businessData.data);

        if (businessData.data?._id) {
          const productsResponse = await fetch(
            `/api/products/${businessData.data._id}`,
            { signal }
          );
          if (!productsResponse.ok) throw new Error("Error fetching products");

          const productsData = await productsResponse.json();
          setProducts(productsData.data);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError("An error occurred while fetching data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchBusinessAndProducts(abortController.signal);
    return () => abortController.abort();
  }, [fetchBusinessAndProducts, session?.user?.id]);

  const handleProductDetails = useCallback(
    (productId) => {
      const product = products.find((prod) => productId === prod._id);
      if (product) {
        setSelectedProduct(product);
        setIsModalOpen(true);
      }
    },
    [products]
  );

  const handleAddToCart = useCallback(
    (product) => {
      addToCart(product);
      toast.success("Added item to cart");
    },
    [addToCart]
  );

  const handleCategoryChange = useCallback((category) => {
    setCat(category);
  }, []);

  const filteredProducts = products.filter(
    (product) => cat === "All" || product.cuisineType === cat
  );

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />

      {isModalOpen && selectedProduct && (
        <FoodDetailsModal
          {...selectedProduct}
          addToCart={handleAddToCart}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <main className="container mx-auto max-w-screen-xl border p-4">
        <div className="lg:flex gap-8">
          <section className="w-full lg:w-3/4">
            <HeroSection loading={loading} profile={profile} />
            <RestaurantInfo loading={loading} profile={profile} />
            <MenuSection
              loading={loading}
              profile={profile}
              products={filteredProducts}
              cat={cat}
              onCategoryChange={handleCategoryChange}
              onProductDetails={handleProductDetails}
            />
            <Reviews businessId={profile?._id} />
            <OpeningHoursAndContact loading={loading} profile={profile} />
          </section>

          <aside className="hidden lg:block border-l lg:w-1/4">
            <div className="sticky top-4 bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Your Cart</h2>
              <CartContent />
            </div>
          </aside>
        </div>
      </main>
      <BackToTopButton />
      <Footer />
    </>
  );
};

const HeroSection = ({ loading, profile }) => (
  <div className="relative h-80 mb-6 rounded-xl overflow-hidden">
    {loading ? (
      <div className="h-full w-full bg-gray-300 animate-pulse flex items-center justify-center"></div>
    ) : (
      <img
        src={profile?.coverImage}
        className="w-full h-full object-cover"
        alt={profile?.businessName}
      />
    )}
  </div>
);

const RestaurantInfo = ({ loading, profile }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center mb-4">
      {loading ? (
        <div className="h-8 bg-gray-300 rounded w-1/3 animate-pulse"></div>
      ) : (
        <h1 className="text-3xl font-bold">{profile?.businessName}</h1>
      )}
      {loading ? (
        <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
      ) : (
        <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
          <Star className="text-yellow-500 mr-1" size={16} />
          <span className="font-medium">4.5</span>
          <span className="text-sm text-gray-600 ml-1">(5)</span>
        </div>
      )}
    </div>
    <div className="flex justify-between text-sm text-gray-600 mb-6">
      <div>
        <p className="font-semibold text-gray-800">Opening time</p>
        <p>9:00am-12:00am</p>
      </div>
      <div>
        <p className="font-semibold text-gray-800">Cuisine</p>
        <p className="text-green-600">African</p>
      </div>
    </div>
  </div>
);

const MenuSection = ({
  loading,
  profile,
  products,
  cat,
  onCategoryChange,
  onProductDetails,
}) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-4">
      {profile?.businessType === "restaurant" ? "Our Menu" : "Products"}
    </h2>
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
          <CategoryButton
            category="All"
            currentCategory={cat}
            onClick={onCategoryChange}
          />
          {profile?.cuisineType?.map((item) => (
            <CategoryButton
              key={item}
              category={item}
              currentCategory={cat}
              onClick={onCategoryChange}
            />
          ))}
        </>
      )}
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      {loading ? (
        Array(4)
          .fill()
          .map((_, index) => <Productscardskeleton key={index} />)
      ) : products?.length > 0 ? (
        products?.map((product) => (
          <ProductCard
            key={product._id}
            {...product}
            onclick={() => onProductDetails(product._id)}
          />
        ))
      ) : (
        <div className="text-center text-gray-500 col-span-2">
          No products available.
        </div>
      )}
    </div>
  </div>
);

const CategoryButton = ({ category, currentCategory, onClick }) => (
  <button
    onClick={() => onClick(category)}
    className={`px-4 py-2 rounded-full flex-shrink-0 transition duration-300 ${
      category === currentCategory
        ? "bg-green-600 text-white"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    }`}
  >
    {category}
  </button>
);

const OpeningHoursAndContact = ({ loading, profile }) => (
  <div className="grid md:grid-cols-2 gap-8">
    <div className="mt-5">
      <h2 className="text-2xl font-bold mb-4">Opening Hours</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        {loading ? (
          Array(7)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="h-4 bg-gray-300 rounded mb-2 animate-pulse"
              ></div>
            ))
        ) : (
          <ul className="text-sm text-gray-600">
            <li className="flex justify-between py-2">
              <span>Monday</span>
              <span>9:00am - 12:00am</span>
            </li>
          </ul>
        )}
      </div>
    </div>

    <div>
      <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        {loading ? (
          <div className="h-6 bg-gray-300 rounded mb-4 animate-pulse"></div>
        ) : (
          <>
            <div className="flex items-center mb-2">
              <Phone className="text-green-600 mr-2" />
              <span>{profile?.phone || "N/A"}</span>
            </div>
            <div className="flex items-center mb-2">
              <Mail className="text-green-600 mr-2" />
              <span>{profile?.email || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <LocateIcon className="text-green-600 mr-2" />
              <span>{profile?.address || "N/A"}</span>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);

export default Restaurant;
