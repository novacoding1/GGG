import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactFlow } from '@xyflow/react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
  Focus,
  Map,
  RotateCcw,
} from 'lucide-react';
import { useTreeStore } from '@/shared/store/treeStore';

interface Props {
  onToggleMinimap: () => void;
  isMinimapVisible: boolean;
}

export const CanvasToolbar: React.FC<Props> = ({ onToggleMinimap, isMinimapVisible }) => {
  const { t } = useTranslation();
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { undo, redo, canUndo, canRedo, resetToSingleRoot } = useTreeStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 bg-white/90 backdrop-blur-2xl border border-sky-100 rounded-2xl p-1.5 shadow-apple-card text-slate-800">
      {/* Undo */}
      <button
        onClick={undo}
        disabled={!canUndo()}
        title={t('app.undo')}
        className="p-2.5 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-700"
      >
        <Undo2 className="w-4 h-4" />
      </button>

      {/* Redo */}
      <button
        onClick={redo}
        disabled={!canRedo()}
        title={t('app.redo')}
        className="p-2.5 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-700"
      >
        <Redo2 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-200 my-auto" />

      {/* Zoom In */}
      <button
        onClick={() => zoomIn()}
        className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-700"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Zoom Out */}
      <button
        onClick={() => zoomOut()}
        className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-700"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* Fit View / Center */}
      <button
        onClick={() => fitView({ duration: 600 })}
        className="p-2.5 rounded-xl hover:bg-sky-50 transition-colors text-sky-600 font-bold"
        title={t('app.centerTree')}
      >
        <Focus className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-slate-200 my-auto" />

      {/* Toggle Minimap */}
      <button
        onClick={onToggleMinimap}
        className={`p-2.5 rounded-xl transition-colors ${
          isMinimapVisible ? 'bg-sky-100 text-sky-700' : 'hover:bg-slate-100 text-slate-500'
        }`}
        title={t('app.minimap')}
      >
        <Map className="w-4 h-4" />
      </button>

      {/* Fullscreen */}
      <button
        onClick={toggleFullscreen}
        className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-700"
        title={t('app.fullscreen')}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      <div className="w-px h-5 bg-slate-200 my-auto" />

      {/* Reset to Single Root */}
      <button
        onClick={resetToSingleRoot}
        className="p-2.5 rounded-xl hover:bg-amber-50 text-amber-600 transition-colors"
        title="1 Бастапқы кругке оралу (Алаш)"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
