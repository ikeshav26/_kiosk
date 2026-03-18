import { useState } from "react";
import { View, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const Campus360 = () => {
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="h-full w-full bg-slate-50 rounded-2xl shadow-xl overflow-hidden relative border border-gray-100">
      {/* Floating Toggle Navigation */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 p-1.5 bg-white/70 backdrop-blur-md rounded-full shadow-lg border border-white/40">
        <button
          onClick={() => setShowVirtualTour(false)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
            !showVirtualTour
              ? "bg-primary text-white shadow-md scale-100" // using blue-900 equivalent or theme color
              : "text-gray-600 hover:bg-gray-100/50 hover:text-primary scale-95 opacity-80"
          }`}
        >
          <View className="w-5 h-5" />
          <span>{t('Campus_Map.Campus_360')}</span>
        </button>

        <button
          onClick={() => setShowVirtualTour(true)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
            showVirtualTour
              ? "bg-primary text-white shadow-md scale-100"
              : "text-gray-600 hover:bg-gray-100/50 hover:text-primary scale-95 opacity-80"
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>{t('Campus_Map.Virtual_Tour')}</span>
        </button>
      </div>

      {/* Viewers */}
      <div className="w-full h-full relative">
        <iframe
          src="./virtual-tour/index.html?sceneId=5Pd9XFNOX"
          className={`absolute top-0 left-0 w-full h-full border-0 transition-opacity duration-700 ${
            showVirtualTour ? "opacity-100 z-10" : "opacity-0 -z-10 pointer-events-none"
          }`}
          allow="fullscreen"
        ></iframe>

        <iframe
          src="./campus360/360.babafaridgroup.edu.in/index.html"
          className={`absolute top-0 left-0 w-full h-full border-0 transition-opacity duration-700 ${
            !showVirtualTour ? "opacity-100 z-10" : "opacity-0 -z-10 pointer-events-none"
          }`}
          allow="fullscreen"
        ></iframe>
      </div>
    </div>
  );
};

export default Campus360;
