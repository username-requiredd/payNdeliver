const Productscardskeleton = () => {
  return (
    <>
      <div className="w-full">
        <div className="flex bg-white border h-28 border-gray-200 rounded-lg shadow  h-30 min-w-0">
          <div className="flex flex-col justify-between p-2 leading-tight w-2/3 max-w-full min-w-0 overflow-hidden">
            <div className="dsc">
              <h5 className="h-3 rounded w-1/2 bg-gray-300 animate-pulse "></h5>
              <p className="h-2 mt-2 bg-gray-300 rounded-md animate-pulse"></p>
            </div>
            <div className="h-2 bg-gray-300 w-8 animate-pulse rounded-md"></div>
          </div>
          <div className=" h-full p-2 w-1/3 min-w-0 animate-pulse flex justify-center items-center bg-gray-300">
          <div className="w-14 h-17"></div>
            {/* <img
              className="object-cover w-14 h-17 rounded-r-lg"
              src="/images/imageplaceholder.png"
              alt=""
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Productscardskeleton;
