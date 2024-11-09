import Link from "next/link";

// Function to format price dynamically
const formatCurrency = (amount, locale = "en-US", currency = "NGN") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const ProductCard = ({ image, name, description, price, onclick, id }) => {
  const test = () => {
    // console.log("test:", image, name, description, price, id);
  };

  return (
    <>
      <div
        className="w-full shadow-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        id={id}
        onClick={onclick}
      >
        <div
          className="flex bg-white border h-28 border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 h-30 min-w-0"
          onClick={test}
        >
          <div className="flex flex-col justify-between p-2 leading-tight w-2/3 max-w-full min-w-0 overflow-hidden">
            <div className="description">
              <h5 className="font-semibold text-ellipsis truncate text-xs sm:text-sm">
                {name}
              </h5>
              <p className="text-xs mt-2 text-gray-700 dark:text-gray-400 truncate">
                {description}
              </p>
            </div>
            <div className="text-xs sm:text-sm font-bold text-green-700">
              {formatCurrency(price, "en-NG", "NGN")}{" "}
            </div>
          </div>
          <div className="h-full w-1/3 min-w-0">
            <img
              className="object-cover h-full w-full rounded-r-lg"
              src={image || "/images/placeholder.jpg"}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
