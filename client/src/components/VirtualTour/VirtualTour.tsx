import React, { useState, useMemo, useEffect } from 'react';
import { Pannellum } from 'pannellum-react';
// import 'pannellum-react/lib/pannellum/css/pannellum.css';
import './VirtualTour.css';
import tourData from './tourData.json';

export interface VirtualTourProps {
  sceneId?: string | null;
  className?: string;
  onSceneChange?: (sceneId: string) => void;
}

interface Coords {
  x: number;
  y: number;
  z: number;
}

// Exact geometric proof of Three.js SphereGeometry mapped to Pannellum:
// Three.js puts U=0.5 (center of image) at +X. Pannellum places it at yaw=0.
// This directly maps to yaw = atan2(-z, x).
function coordsToPitchYaw(sceneCoords: Coords) {
  // CloudPano uses local coordinates for `plane` to correctly position hotspots 
  // scaled directly to the sphere. We will fallback to `scene` if `plane` is missing.
  const { x, y, z } = sceneCoords;
  
  // Rotate mapping exactly 180 degrees on one axis (X perfect, Z inverted)
  const yaw = Math.atan2(-z, x) * (180 / Math.PI);
  
  const distance = Math.sqrt(x * x + y * y + z * z);
  const pitch = Math.atan2(y, Math.sqrt(x * x + z * z)) * (180 / Math.PI);
  
  return { pitch, yaw, distance };
}

function renderCustomTooltip(hotSpotDiv: HTMLElement, args: any) {
  // Only append exactly once
  if (!hotSpotDiv.querySelector('.pnlm-tooltip')) {
    // Inject a simple Unicode text arrow
    const arrowSpan = document.createElement('div');
    arrowSpan.className = 'simple-arrow-icon';
    arrowSpan.innerHTML = '▲'; // Clean, universally supported triangle arrow
    hotSpotDiv.appendChild(arrowSpan);

    // Inject the tooltip text
    const span = document.createElement('span');
    span.innerHTML = args.text;
    span.className = 'pnlm-tooltip';
    hotSpotDiv.appendChild(span);
  }
}

export const VirtualTour: React.FC<VirtualTourProps> = ({
  sceneId,
  className = "w-full h-full",
  onSceneChange
}) => {
  const defaultSceneId = tourData.length > 0 ? tourData[0].id : null;
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(sceneId || defaultSceneId);

  useEffect(() => {
    if (sceneId && sceneId !== currentSceneId) {
      setCurrentSceneId(sceneId);
    }
  }, [sceneId]);

  const handleHotspotClick = (targetSceneId: string | null) => {
    if (targetSceneId) {
      setCurrentSceneId(targetSceneId);
      if (onSceneChange) onSceneChange(targetSceneId);
    }
  };

  const currentScene = useMemo(() => {
    return tourData.find(s => s.id === currentSceneId) || tourData[0];
  }, [currentSceneId]);

  if (!currentScene) {
    return <div className="flex items-center justify-center h-full w-full bg-slate-900 text-white">No Tour Data Found</div>;
  }

  // Pre-load images for smoother transitions?
  // pannellum-react forces a re-render/re-mount of the viewer when `image` changes, so we just pass the new one.
  return (
    <div className={`relative ${className} bg-slate-900`}>
      <Pannellum
        key={currentScene.id}
        width="100%"
        height="100%"
        image={`./virtual-tour/${currentScene.url}`}
        pitch={0}
        yaw={0}
        hfov={100}
        autoLoad
        crossOrigin="anonymous"
        autoRotate={-2} // gentle rotation
        compass={false}
        showZoomCtrl={false}
        showFullscreenCtrl={false}
        mouseZoom={true}
        onLoad={() => {
            console.log(`Pannellum loaded scene ${currentScene.title}`);
        }}
      >
        {currentScene.hotspots.map((hotspot, idx) => {
          // Prevent rendering a hotspot that points to the exact scene we are already in, or is an info hotspot
          if (!hotspot.targetSceneId || hotspot.targetSceneId === currentScene.id) return null;

          // CloudPano's `plane` coordinates perfectly map local geometries, but `scene` can be used as fallback
          const rawCoords = hotspot.coords?.plane || hotspot.coords?.scene;
          if (!rawCoords) return null;
          
          const { pitch, yaw, distance } = coordsToPitchYaw(rawCoords);
          
          // Mimic 3D depth by sizing down targets further away. Max size at close range (500 units)
          const scale = Math.max(0.3, Math.min(1.2, 500 / distance));
          
          return (
            <Pannellum.Hotspot
              key={hotspot.id || idx}
              type="custom"
              pitch={pitch}
              yaw={yaw}
              cssClass={hotspot.targetSceneId ? "custom-arrow-hotspot" : "custom-info-hotspot"}
              createTooltipFunc={renderCustomTooltip}
              createTooltipArgs={{ text: hotspot.title, scale, icon: hotspot.targetSceneId ? '↑' : 'i' }}
              handleClick={() => handleHotspotClick(hotspot.targetSceneId)}
            />
          );
        })}
      </Pannellum>

      {/* Floating Info Overlay */}
      <div className="absolute top-6 left-6 z-50 bg-black/60 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-2xl pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400">
           <span className="text-white font-bold text-xs">360</span>
        </div>
        <div>
          <h3 className="text-white font-bold text-sm tracking-wide">{currentScene.title}</h3>
          <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Select nodes to navigate</p>
        </div>
      </div>
    </div>
  );
};
