"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/contex/cartcontex";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Star,
  Phone,
  LocateIcon,
  Mail,
  Clock,
  Tag,
  MapPin,
} from "lucide-react";

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
        id: product.id,
        storeId: profile._id,
        storeEmail: profile.email,
        storeName: profile.businessName,
        quantity: product.quantity || 1, // Default to 1 if not provided
        description: product.description,
        name: product.name,
        price: product.price,
        image: product.image,
      };

      // console.log("Attempting to add to cart:", cartProduct);

      try {
        addToCart(cartProduct); // Directly pass the cartProduct
        toast.success("Added item to cart");
      } catch (error) {
        toast.error(error.message || "Failed to add item to cart");
        console.error("Error adding to cart:", error);
      }
    },
    [addToCart, profile]
  );
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
    <div className="min-h-screen bg-white">
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

      <main className="container mx-auto max-w-screen-xl px-4 py-6">
        <div className="lg:flex gap-10">
          <section className="w-full lg:w-3/4 space-y-10">
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

          <aside className="hidden lg:block lg:w-1/4">
            <div className="sticky top-24 bg-white border border-gray-100 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
              <CartContent />
            </div>
          </aside>
        </div>
      </main>
      <BackToTopButton />
      <Footer />
    </div>
  );
};

const HeroSection = ({ loading, profile }) => (
  <div className="relative h-[500px] rounded-3xl overflow-hidden">
    {loading ? (
      <div className="h-full w-full bg-gray-100 animate-pulse"></div>
    ) : (
      <>
        <div className="absolute inset-0  "></div>
        <img
          src={profile?.coverImage || "/images/placeholder.jpg"}
          className="w-full h-full object-cover"
          alt={profile?.businessName}
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          <div className="flex items-center space-x-4 mb-4">
            <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm">
              {profile?.businessType}
            </span>
            <div className="flex items-center bg-white/20 backdrop-blur-md px-4 py-1 rounded-full">
              <Star className="text-yellow-400 mr-2" size={16} />
              <span className="text-white text-sm">4.5 (5 reviews)</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            {profile?.businessName}
          </h1>
          <div className="flex items-center text-white/80">
            <MapPin className="mr-2" size={18} />
            <span className="text-sm">
              {profile?.address || "Location N/A"}
            </span>
          </div>
        </div>
      </>
    )}
  </div>
);

const RestaurantInfo = ({ loading, profile }) => (
  <div className="flex items-center justify-between border-b border-gray-100 pb-6">
    {loading ? (
      <div className="h-8 bg-gray-100 rounded w-1/3 animate-pulse"></div>
    ) : (
      <>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Open Now</span>
          </div>

          <div className="text-sm text-gray-600">
            <Clock className="inline mr-2" size={16} />
            9:00 AM - 12:00 AM
          </div>
        </div>
        <button className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
          Follow
        </button>
      </>
    )}
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
  <div>
    <h2 className="text-3xl font-bold mb-8">
      {profile?.businessType === "Restaurant" ? "Our Menu" : "Products"}
    </h2>

    <div className="flex space-x-2 overflow-x-auto pb-6 mb-8 scrollbar-hide">
      {loading ? (
        Array(6)
          .fill()
          .map((_, index) => (
            <div
              key={index}
              className="h-12 w-28 bg-gray-100 rounded-full animate-pulse flex-shrink-0"
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

    <div className="grid md:grid-cols-2 gap-8">
      {loading ? (
        Array(4)
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
        <div className="col-span-2 py-20 text-center">
          <div className="text-gray-400 text-lg">No products available yet</div>
        </div>
      )}
    </div>
  </div>
);

const CategoryButton = ({ category, currentCategory, onClick }) => (
  <button
    onClick={() => onClick(category)}
    className={`px-6 py-3 rounded-full flex-shrink-0 transition-all duration-300 text-sm font-medium ${
      category === currentCategory
        ? "bg-black text-white scale-105"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {category}
  </button>
);

const OpeningHoursAndContact = ({ loading, profile }) => (
  <div className="grid md:grid-cols-2 gap-10">
    <div>
      <h2 className="text-2xl font-bold mb-6">Opening Hours</h2>
      <div className="space-y-4">
        {loading ? (
          Array(7)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="h-4 bg-gray-100 rounded animate-pulse"
              ></div>
            ))
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium">Monday</span>
              <span className="text-gray-600">9:00 AM - 12:00 AM</span>
            </div>
            {/* Add other days similarly */}
          </div>
        )}
      </div>
    </div>

    <div>
      <h2 className="text-2xl font-bold mb-6">Contact</h2>
      {loading ? (
        <div className="space-y-4">
          {Array(3)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="h-6 bg-gray-100 rounded animate-pulse"
              ></div>
            ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center group cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
              <Phone size={20} />
            </div>
            <span className="ml-4">{profile?.phone || "N/A"}</span>
          </div>
          <div className="flex items-center group cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
              <Mail size={20} />
            </div>
            <span className="ml-4">{profile?.email || "N/A"}</span>
          </div>
          <div className="flex items-center group cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
              <LocateIcon size={20} />
            </div>
            <span className="ml-4">{profile?.address || "N/A"}</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default ShopDetails;
