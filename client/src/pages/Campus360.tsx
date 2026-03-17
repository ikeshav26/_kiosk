import { useState } from "react";

const Campus360 = () => {
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-md overflow-hidden relative">
      {showVirtualTour ? (
        <>
          <button
            onClick={() => setShowVirtualTour(false)}
            className="absolute top-4 left-4 z-10 px-6 py-3 bg-white text-blue-900 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 border-2 border-blue-900"
          >
            Home
          </button>
          <iframe
            src="./virtual-tour/index.html"
            className="myiframe w-full h-full border-0 rounded-xl"
            allow="fullscreen"
          ></iframe>
        </>
      ) : (
        <>
          <button
            onClick={() => setShowVirtualTour(true)}
            className="absolute top-4 left-4 z-10 px-6 py-3 bg-blue-900 text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 transition duration-300"
          >
            Campus Tour
          </button>
          <iframe
            src="./campus360/360.babafaridgroup.edu.in/index.html"
            className="myiframe w-full h-full border-0 rounded-xl"
            allow="fullscreen"
          ></iframe>
        </>
      )}
    </div>
  );
};

export default Campus360;
