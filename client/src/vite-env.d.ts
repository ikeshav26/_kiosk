/// <reference types="vite/client" />
/// <reference types="node" />

interface Window {
  ipcRenderer: import('electron').ipcRenderer;
}

declare module 'pannellum-react' {
  import * as React from 'react';

  export interface PannellumProps {
    id?: string;
    width?: string;
    height?: string;
    image?: string;
    video?: string;
    yaw?: number;
    pitch?: number;
    hfov?: number;
    minHfov?: number;
    maxHfov?: number;
    minPitch?: number;
    maxPitch?: number;
    minYaw?: number;
    maxYaw?: number;
    autoRotate?: number;
    compass?: boolean;
    title?: string;
    author?: string;
    preview?: string;
    previewTitle?: string;
    previewAuthor?: string;
    autoLoad?: boolean;
    orientationOnByDefault?: boolean;
    showZoomCtrl?: boolean;
    showFullscreenCtrl?: boolean;
    keyboardZoom?: boolean;
    mouseZoom?: boolean;
    draggable?: boolean;
    disableKeyboardCtrl?: boolean;
    crossOrigin?: string;
    hotspotDebug?: boolean;
    onLoad?: () => void;
    onScenechange?: (sceneId: string) => void;
    onScenechangefadedone?: () => void;
    onError?: (error: any) => void;
    onErrorcleared?: () => void;
    onMousedown?: (e: MouseEvent) => void;
    onMouseup?: (e: MouseEvent) => void;
    onTouchstart?: (e: TouchEvent) => void;
    onTouchend?: (e: TouchEvent) => void;
    children?: React.ReactNode;
  }

  export interface HotspotProps {
    type?: 'info' | 'scene' | 'custom';
    pitch?: number;
    yaw?: number;
    text?: string;
    URL?: string;
    cssClass?: string;
    createTooltipFunc?: (hotSpotDiv: HTMLElement, args: any) => void;
    createTooltipArgs?: any;
    handleClick?: (e: MouseEvent, args: any) => void;
    handleClickArg?: any;
  }

  export class Pannellum extends React.Component<PannellumProps> {
    static Hotspot: React.FC<HotspotProps>;
  }
}
