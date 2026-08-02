import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import {
  Sun,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  RefreshCw,
  Layers,
  Globe,
  Share2,
} from 'lucide-react';
import { useTreeStore } from '@/shared/store/treeStore';
import { useAuthStore } from '@/shared/store/authStore';
import { ExportModal } from '@/features/export-import/components/ExportModal';
import { ImportModal } from '@/features/export-import/components/ImportModal';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {
    lastSavedAt,
    isSaving,
    isFinalized,
    toggleFinalize,
    resetToSingleRoot,
    layoutOrientation,
    setLayoutOrientation,
  } = useTreeStore();

  const { setLanguage } = useAuthStore();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleFinalize = () => {
    toggleFinalize();
    confetti({
      particleCount: 120,
      spread: 80,
      colors: ['#00A3E0', '#FFC72C', '#FFFFFF'],
      origin: { y: 0.6 },
    });
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'kk' ? 'ru' : i18n.language === 'ru' ? 'en' : 'kk';
    i18n.changeLanguage(nextLang);
    setLanguage(nextLang as any);
  };

  return (
    <>
      <header className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        {/* Left Branding & Save Status */}
        <div className="flex items-center gap-3 pointer-events-auto bg-white/90 backdrop-blur-2xl border border-sky-100 rounded-2xl px-4 py-2 shadow-apple-card">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white font-black">
            <Sun className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-slate-900 font-outfit">
              {t('app.title')}
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              {isSaving ? (
                <>
                  <RefreshCw className="w-3 h-3 text-sky-500 animate-spin" />
                  <span>{t('app.saving')}</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  <span>{t('app.saved')} {lastSavedAt}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions Bar (Simplified) */}
        <div className="flex items-center gap-2 pointer-events-auto bg-white/90 backdrop-blur-2xl border border-sky-100 rounded-2xl p-1.5 shadow-apple-card">
          {/* Orientation Toggle */}
          <button
            onClick={() =>
              setLayoutOrientation(layoutOrientation === 'horizontal' ? 'vertical' : 'horizontal')
            }
            title={t('app.autoLayout')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <Layers className="w-4 h-4 text-sky-600" />
            <span className="hidden md:inline">
              {layoutOrientation === 'horizontal' ? t('app.horizontal') : t('app.vertical')}
            </span>
          </button>

          {/* Import */}
          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <Upload className="w-4 h-4 text-sky-600" />
            <span className="hidden md:inline">{t('app.import')}</span>
          </button>

          {/* Export */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline">{t('app.export')}</span>
          </button>

          {/* Clear to Single Root */}
          <button
            onClick={resetToSingleRoot}
            title="Бастапқы 1 кругка қайтару (Алаш)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">1 Круг</span>
          </button>

          {/* Language quick switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sky-600 text-xs font-bold transition-colors uppercase"
          >
            <Globe className="w-3.5 h-3.5" />
            {i18n.language}
          </button>

          {/* Finalize Button */}
          <button
            onClick={handleFinalize}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
              isFinalized
                ? 'bg-purple-600 text-white'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-gold-glow'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t('app.finalize')}</span>
          </button>
        </div>
      </header>

      {/* Modals */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </>
  );
};
