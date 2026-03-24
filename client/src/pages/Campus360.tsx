import { useState, memo } from 'react';
import { View, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VirtualTourIframe = memo(() => (
  <iframe
    src="https://virtual-tour-bfgi.vercel.app/"
    className="absolute top-0 left-0 w-full h-full border-0"
    allow="fullscreen"
    title="Virtual Tour"
  />
));

const Campus360Iframe = memo(() => (
  <iframe
    src="https://ikeshav26.github.io/campus-360/"
    className="absolute top-0 left-0 w-full h-full border-0"
    allow="fullscreen"
    title="Campus 360"
  />
));

VirtualTourIframe.displayName = 'VirtualTourIframe';
Campus360Iframe.displayName = 'Campus360Iframe';

const Campus360 = memo(() => {
  const [showVirtualTour, setShowVirtualTour] = useState(true);
  const { t } = useTranslation();

  return (
    <div className="h-full w-full bg-slate-50 rounded-2xl shadow-xl overflow-hidden relative border border-gray-100">
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 p-1.5 bg-white/70 backdrop-blur-md rounded-full shadow-lg border border-white/40">
        <button
          onClick={() => setShowVirtualTour(true)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
            showVirtualTour
              ? 'bg-primary text-white shadow-md scale-100'
              : 'text-gray-600 hover:bg-gray-100/50 hover:text-primary scale-95 opacity-80'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>{t('Campus_Map.Virtual_Tour')}</span>
        </button>

        <button
          onClick={() => setShowVirtualTour(false)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
            !showVirtualTour
              ? 'bg-primary text-white shadow-md scale-100'
              : 'text-gray-600 hover:bg-gray-100/50 hover:text-primary scale-95 opacity-80'
          }`}
        >
          <View className="w-5 h-5" />
          <span>{t('Campus_Map.Campus_360')}</span>
        </button>
      </div>

      <div className="w-full h-full relative">
        {showVirtualTour ? (
          <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-700 opacity-100 z-10">
            <VirtualTourIframe />
          </div>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-700 opacity-100 z-10">
            <Campus360Iframe />
          </div>
        )}
      </div>
    </div>
  );
});

Campus360.displayName = 'Campus360';

export default Campus360;
