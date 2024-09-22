const ShopCardSkeleton = () => {
  return (
    <>
      <div className=" p-2 rounded-xl">
        <div className="relative  w-full rounded-lg overflow-hidden">
          <div className="flex items-center justify-center h-48 w-full bg-gray-300 animate-pulse">
            <div className="w-14 h-17"></div>
            {/* <img
              src="/images/imageplaceholder.png"
              className="h-17 w-14 object-cover"
            /> */}
          </div>
        </div>
        <div className="w-full mt-3">
          <div className="flex justify-between items-center">
            <p className="h-3 bg-gray-300 animate-pulse rounded-md w-1/2"></p>
            <span className=" h-2 w-8 animate-pulse bg-gray-300 rounded-md  mx-2"></span>
          </div>
          <div>
            <div className="time flex items-center text-sm my-3">
              <span className="h-2 animate-pulse bg-gray-300 w-12 rounded-md"></span>
            </div>{" "}
            <div className=" mt-4  ">
              {/* <span className=" rounded-md animate-pulse bg-gray-300 h-2 w-8"></span>
              <span className=" rounded-md animate-pulse bg-gray-300 h-2 mx-2 w-8 "></span>
              <span className=" rounded-md animate-pulse bg-gray-300 h-2 mx-2 w-8 "></span>
              <span className=" rounded-md animate-pulse bg-gray-300 h-2 mx-2 w-8 "></span> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopCardSkeleton;
