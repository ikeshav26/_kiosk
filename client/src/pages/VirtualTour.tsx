import { useSearchParams } from 'react-router-dom';
import { VirtualTour as VirtualTourComponent } from '../components/VirtualTour';

const VirtualTour = () => {
  const [searchParams] = useSearchParams();
  const sceneId = searchParams.get('sceneId');

  return (
    <div className="h-full w-full bg-slate-50 rounded-2xl shadow-xl overflow-hidden relative border border-gray-100">
      <VirtualTourComponent sceneId={sceneId} />
    </div>
  );
};

export default VirtualTour;
