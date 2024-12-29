import Link from "next/link";
import { Suspense } from "react";
import ShopCard from "@/components/shopCards";
import Header from "@/components/header";
import ShopCardSkeleton from "@/components/loaders/shopCardskeleton";
import Footer from "@/components/footer";
import {
  Search,
  Utensils,
  PizzaIcon,
  Pill,
  ShoppingBag,
  ShoppingCart,
  Shirt,
} from "lucide-react";
import SearchBar from "./serachbar";

// Enhanced fetch function to handle both category and search
async function fetchBusinesses(category = "All", search = "") {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  
  try {
    const response = await fetch(
      `${baseUrl}/api/business?category=${category}&search=${encodeURIComponent(search)}`, 
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      // Improved error handling
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch business data");
    }

    return response.json();
  } catch (error) {
    // console.error("Error fetching businesses:", error);
    return { data: [], message: error.message };
  }
}

// Category Link Component with improved typing
const CategoryLink = ({ children, icon: Icon, isActive, href }) => (
  <Link
    href={href}
    className={`
      flex items-center px-4 py-2 rounded-full transition-all duration-300 
      shadow-sm hover:shadow-md group
      ${
        isActive
          ? "bg-emerald-500 text-white scale-105 shadow-emerald-200"
          : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
      }
    `}
  >
    <Icon
      className={`
        mr-2 transition-colors duration-300
        ${isActive ? "stroke-white" : "stroke-emerald-500 group-hover:stroke-emerald-700"}
      `}
      size={20}
    />
    <span className="font-semibold text-sm">{children}</span>
  </Link>
);

// Categories with icons
const categories = [
  { name: "All", icon: ShoppingCart },
  { name: "Restaurant", icon: Utensils },
  { name: "Pharmacy", icon: Pill },
  { name: "Provision", icon: ShoppingBag },
  { name: "Fashion", icon: Shirt },
  { name: "Others", icon: PizzaIcon },
];

export default async function Stores({ searchParams }) {
  // Extract search parameters with default values
  const activeCategory = searchParams.category || "All";
  const searchQuery = searchParams.search || "";

  // Fetch businesses with category and search
  const { data, message } = await fetchBusinesses(activeCategory, searchQuery);

  return (
    <div className=" min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-4 scroll-smooth">
            {categories.map((category) => (
              <CategoryLink
                key={category.name}
                icon={category.icon}
                isActive={activeCategory === category.name}
                href={`/stores?category=${category.name}${searchQuery ? `&search=${searchQuery}` : ''}`}
              >
                {category.name}
              </CategoryLink>
            ))}
          </div>
        </div>

        {/* Page Header */}
        <header className="mb-8 space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {activeCategory === "All" && !searchQuery
              ? "Explore All Stores"
              : searchQuery
              ? `Search Results for "${searchQuery}"`
              : `${activeCategory} Stores`}
          </h1>
          
          {/* Search Bar with Enhanced Design */}

              <SearchBar activeCategory={activeCategory}/>

        </header>

        {/* Store Cards with Suspense and Error Handling */}
        <Suspense fallback={<ShopCardsSkeleton />}>
          {data.length > 0 ? (
            <ShopCards data={data} />
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-xl">
                {message || "No stores found matching your search or category."}
              </p>
            </div>
          )}
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}

function ShopCards({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.map(({ _id, coverImage, businessName, cuisineType }) => (
        <ShopCard
          key={_id}
          id={_id}
          image={coverImage}
          title={businessName}
          rating={5}
          categories={cuisineType}
          deliverytime={"9:00am - 4:00pm"}
        />
      ))}
    </div>
  );
}

function ShopCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <ShopCardSkeleton key={index} />
      ))}
    </div>
  );
}