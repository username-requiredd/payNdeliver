const CartSkeleton = () => {
  return (
    <>
      <div className="flex px-2 py-6 border-b">
        <div className="h-24 w-24 flex-shrink-0 bg-gray-300 animate-pulse overflow-hidden rounded-md ">
          {/* <img
            src="https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg"
            alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
            className="h-full w-full object-cover object-center"
          /> */}
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between text-base font-medium text-gray-900">
              <h3 className="h-3 w-1/2 bg-gray-300 animate-pulse rounded-md">
                {/* <a href="#">Throwback Hip Bag</a> */}
              </h3>
              <p className="ml-4 h-2 w-10 rounded-md bg-gray-300 animate-pulse"></p>
            </div>
            <p className="mt-1 text-sm h-2 bg-gray-300 animate-pulse w-16 rounded-md">
              {/* Salmon */}
            </p>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="bg-gray-300 w-10 animate-pulse rounded-md h-2 ">
              {/* Qty 1 */}
            </p>

            <div className="flex"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSkeleton;
