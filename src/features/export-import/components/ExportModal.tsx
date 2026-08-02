import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Image, FileCode, FileText, Table, Printer, Download } from 'lucide-react';
import { useTreeStore } from '@/shared/store/treeStore';
import {
  exportToPNG,
  exportToSVG,
  exportToPDF,
  exportToJSON,
  exportToExcel,
  printTree,
} from '../lib/exportUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { nodes } = useTreeStore();

  if (!isOpen) return null;

  const exportOptions = [
    {
      id: 'png',
      title: t('exportModal.png'),
      icon: Image,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      action: () => exportToPNG('shezhire-canvas'),
    },
    {
      id: 'svg',
      title: t('exportModal.svg'),
      icon: FileCode,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      action: () => exportToSVG('shezhire-canvas'),
    },
    {
      id: 'pdf',
      title: t('exportModal.pdf'),
      icon: FileText,
      color: 'text-red-400 bg-red-500/10 border-red-500/30',
      action: () => exportToPDF('shezhire-canvas'),
    },
    {
      id: 'json',
      title: t('exportModal.json'),
      icon: FileCode,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      action: () => exportToJSON(nodes),
    },
    {
      id: 'excel',
      title: t('exportModal.excel'),
      icon: Table,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      action: () => exportToExcel(nodes),
    },
    {
      id: 'print',
      title: t('exportModal.print'),
      icon: Printer,
      color: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
      action: () => printTree(),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900/90 border border-slate-700/60 rounded-3xl shadow-apple-card text-slate-100 p-6 backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t('exportModal.title')}</h2>
              <p className="text-xs text-slate-400">Барлығы {nodes.length} тұлға</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exportOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  opt.action();
                  onClose();
                }}
                className="flex items-center gap-3 p-3.5 rounded-2xl border bg-slate-800/40 hover:bg-slate-800 transition-all text-left group"
              >
                <div className={`p-2.5 rounded-xl border ${opt.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    {opt.title}
                  </span>
                  <span className="text-[10px] text-slate-400">Жүктеп алу</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
