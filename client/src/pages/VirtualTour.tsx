import { useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const VirtualTour = () => {
  const [searchParams] = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sceneId = searchParams.get('sceneId');

  useEffect(() => {
    if (iframeRef.current && sceneId) {
      // Pass the sceneId to the iframe
      iframeRef.current.src = `https://virtual-tour-bfgi.vercel.app/?sceneId=${sceneId}`;
    }
  }, [sceneId]);

  return (
    <div className="h-full w-full bg-slate-50 rounded-2xl shadow-xl overflow-hidden relative border border-gray-100">
      <iframe
        ref={iframeRef}
        src={
          sceneId
            ? `https://virtual-tour-bfgi.vercel.app/?sceneId=${sceneId}`
            : 'https://virtual-tour-bfgi.vercel.app/'
        }
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
};

export default VirtualTour;
