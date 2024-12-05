"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/contex/cartcontex";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Star, Phone, LocateIcon, Mail } from "lucide-react";

import Header from "@/components/header";
import CustomError from "@/app/error";
import FoodDetailsModal from "@/components/productdetails";
import ProductCard from "@/components/productscard";
import Productscardskeleton from "@/components/loaders/productskeleton";
import CartContent from "./cartcontent";
import Reviews from "./reviews";
import BackToTopButton from "./backtotop";
import Footer from "@/components/footer";
import GetErrorContent from "@/components/geterror";

const ShopDetails = ({ params }) => {
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

        // Handle 404 error
        if (businessResponse.status === 404) {
          throw {
            status: 404,
            message: "Business not found",
          };
        }

        // Handle other non-200 responses
        if (!businessResponse.ok) {
          throw {
            status: businessResponse.status,
            message: "Error fetching business profile",
          };
        }

        const businessData = await businessResponse.json();
        setProfile(businessData.data);
        // console.log("business profile",businessData.data);

        if (businessData.data?._id) {
          const productsResponse = await fetch(
            `/api/products/${businessData.data._id}`,
            { signal }
          );

          if (!productsResponse.ok) {
            throw {
              status: productsResponse.status,
              message: "Error fetching products",
            };
          }

          const productsData = await productsResponse.json();
          setProducts(productsData.data);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          // console.log(err);
          setError({
            status: err.status || 500,
            message: err.message || "An unexpected error occurred",
          });
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
        const transformedProduct = {
          ...product,
          id: product._id,
        };
        setSelectedProduct(transformedProduct);
        setIsModalOpen(true);
        return transformedProduct;
      }
    },
    [products]
  );
  // console.log("profile",profile? profile._id: "")

  const handleAddToCart = useCallback(
    (product) => {
      // Check if profile data is available
      if (!profile?._id || !profile?.businessName) {
        toast.error("Unable to add to cart. Store information is missing.");
        return;
      }
  
      const cartProduct = {
        ...product,
        id: product.id || product._id, // ensure we have an id
        storeId: profile._id,
        storeName: profile.businessName,
        quantity: product.quantity || 1,
        // Add other required fields if they're missing
        name: product.name,
        price: product.price,
        image: product.image
      };
  console.log("cart products:", cartProduct)
      try {
        addToCart(cartProduct);
        toast.success("Added item to cart");
      } catch (error) {
        toast.error(error.message || "Failed to add item to cart");
        console.error("Error adding to cart:", error);
      }
    },
    [addToCart, profile]
  ); // Added profile to dependency array

  const handleCategoryChange = useCallback((category) => {
    setCat(category);
  }, []);

  const filteredProducts = products?.filter(
    (product) => cat === "All" || product.cuisineType === cat
  );

  if (error) {
    const errorContent = GetErrorContent(error);
    return (
      <div className="pt-5">
        <Header />
        <CustomError {...errorContent} />
        <Footer />
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
          _id={selectedProduct._id || selectedProduct.id}
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
        src={profile?.coverImage || "/images/placeholder.jpg"}
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
        {/* <p className="font-semibold text-gray-800">Opening time</p>
        <p>9:00am-12:00am</p> */}
        <p className="font-semibold text-gray-800">Category</p>
        <p className="text-green-600">{profile?.businessType}</p>
      </div>
      <div></div>
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
        Array(1)
          .fill()
          .map((_, index) => <Productscardskeleton key={index} />)
      ) : products && products?.length > 0 ? (
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

export default ShopDetails;
