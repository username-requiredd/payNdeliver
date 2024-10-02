import React from "react";
import { Loader2 } from "lucide-react";

const AnimatedSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative">
        {/* <div className="w-40 h-40 rounded-full animate-spin bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500"> */}
        <div className=" w-36 h-36 transparent rounded-full">
          {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center"> */}
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
          {/* </div> */}
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default AnimatedSpinner;
