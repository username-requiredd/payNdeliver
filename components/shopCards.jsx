import Link from "next/link";
import { Star } from "lucide-react";
const ShopCard = ({ image, title, deliverytime, rating, categories, id }) => {
  return (
    <>
      <Link href={`stores/restaurants/${id}`}>
        <div className="hover:shadow-lg transition-shadow duration-300  rounded-xl">
          <div className="relative w-full rounded-lg overflow-hidden">
            <div className="relative">
              <img src={image || "/images/placeholder.jpg"} className="w-full h-48 object-cover" />
              {/* <div className="absolute top-2 right-2 rounded-full p-1 bg-gray-100">
                <Favorite className="text-red-500 hover:text-red-500 cursor-pointer" />
              </div> */}
            </div>
          </div>
          <div className="w-full mt-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-xl">{title}</p>
              <span className="px-2 text-xs flex justify-center items-center">
                {rating}
                <Star fontSize="13px" className="mx-1 text-yellow-500" />
              </span>
            </div>
            <div>
              <div className="time flex items-center text-sm my-2">
                {/* <span>
                  <AccessTimeIcon className="text-sm text-green-800" />
                </span> */}
                <span className="text-gray-400 px-1">{deliverytime}</span>
              </div>
              <div className="text-green-700">
                {categories&& categories.map((item, index) => (
                  <span key={index} className="mx-2">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ShopCard;
