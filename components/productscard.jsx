import Link from "next/link";

const formatCurrency = (amount, locale = "en-US", currency = "NGN") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const ProductCard = ({ image, name, description, price, onclick, id }) => {
  return (
    <div
      className="group relative w-full bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
      onClick={onclick}
      id={id}
    >
      <div className="flex h-32 overflow-hidden rounded-xl border border-gray-100">
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
              {name}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-green-600 font-bold text-sm sm:text-base">
              {formatCurrency(price, "en-NG", "NGN")}
            </span>
            <span className="inline-flex items-center text-xs text-green-600 font-medium">
              View details
              <svg
                className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="w-1/3 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent z-10" />
          <img
            src={image || "/images/placeholder.jpg"}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
