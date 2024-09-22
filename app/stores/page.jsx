import Link from "next/link";
import { Suspense } from "react";
import ShopCard from "@/components/shopCards";
import Header from "@/components/header";
import ShopCardSkeleton from "@/components/loaders/shopCardskeleton";
import {
  Search,
  Utensils,
  PizzaIcon,
  Pill,
  ShoppingBag,
  ShoppingCart,
  Shirt,
} from "lucide-react";

async function fetchBusiness(category = "All") {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/business?category=${category}`, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error("Failed to fetch business data");
  return response.json();
}

const CategoryLink = ({ children, icon: Icon, isActive, href }) => (
  <Link
    href={href}
    className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 ${
      isActive
        ? "bg-green-500 text-white  scale-105"
        : "bg-white text-gray-700 hover:bg-green-100 hover:text-green-700"
    }`}
  >
    <Icon
      className={`mr-2 ${isActive ? "stroke-white" : "stroke-green-500"}`}
      size={20}
    />
    <span className="font-medium">{children}</span>
  </Link>
);

const categories = [
  { name: "All", icon: ShoppingCart },
  { name: "Restaurants", icon: Utensils },
  { name: "Pizza", icon: PizzaIcon },
  { name: "Pharmacy", icon: Pill },
  { name: "Provision", icon: ShoppingBag },
  { name: "Fashion", icon: Shirt },
];

export default async function Stores({ searchParams }) {
  const activeCategory = searchParams.category || "All";
  const data = await fetchBusiness(activeCategory);
  console.log(data);
  return (
    <>
      <div className="mb-4">
        <Header />
      </div>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex px-5 space-x-4 mb-8 overflow-x-auto pb-4">
            {categories.map((category) => (
              <CategoryLink
                key={category.name}
                icon={category.icon}
                isActive={activeCategory === category.name}
                href={`/stores?category=${category.name}`}
              >
                {category.name}
              </CategoryLink>
            ))}
          </div>

          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {activeCategory === "All"
                ? "All Stores"
                : `${activeCategory} Stores`}
            </h1>
            <form
              action="/stores"
              method="GET"
              className="w-full md:w-1/2 lg:w-1/3 relative"
            >
              <input
                type="text"
                name="search"
                placeholder="Search stores..."
                className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input type="hidden" name="category" value={activeCategory} />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </form>
          </header>

          <Suspense fallback={<ShopCardsSkeleton />}>
            <ShopCards data={data} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function ShopCards({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.data?.map(({ _id, image, name, cuisineType }) => (
        <ShopCard
          key={_id}
          id={_id}
          image={image}
          title={name}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <ShopCardSkeleton key={index} />
      ))}
    </div>
  );
}
