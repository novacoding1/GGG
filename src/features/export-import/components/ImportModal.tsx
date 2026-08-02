import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, FileUp, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useTreeStore } from '@/shared/store/treeStore';
import { ShezhirePerson } from '@/entities/node.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { setNodes } = useTreeStore();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].name) {
            setNodes(parsed as ShezhirePerson[]);
            setSuccessMsg(`Сәтті импортталды: ${parsed.length} тұлға.`);
            setTimeout(() => onClose(), 1200);
          } else {
            setError('JSON форматы жарамсыз. Тұлғалар массиві қажет.');
          }
        } catch {
          setError('JSON файлын оқу мүмкін болмады.');
        }
      };
      reader.readAsText(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet);

          if (jsonData.length > 0) {
            const importedNodes: ShezhirePerson[] = jsonData.map((row, index) => ({
              id: row['ID'] || `imported-${index}-${Date.now()}`,
              name: row['Есімі (Имя)'] || row['name'] || row['Name'] || 'Тұлға',
              description: row['Сипаттамасы (Описание)'] || row['description'] || '',
              birthYear: row['Туған жылы (Год рожд.)'] || row['birthYear'] || '',
              deathYear: row['Қайтыс болған жылы (Год смерти)'] || row['deathYear'] || '',
              gender: (row['Жынысы (Пол)'] === 'Әйел' || row['gender'] === 'female') ? 'female' : 'male',
              zhuz: (row['Жүз (Жуз)'] as any) || 'none',
              clan: row['Род (Ру)'] || row['clan'] || '',
              parentId: row['Атасы ID (Parent ID)'] || row['parentId'] || null,
              nodeColor: '#10B981',
            }));

            setNodes(importedNodes);
            setSuccessMsg(`Excel файлын импорттау сәтті аяқталды (${importedNodes.length} тұлға).`);
            setTimeout(() => onClose(), 1200);
          } else {
            setError('Кестеде деректер табылмады.');
          }
        } catch {
          setError('Excel файлын өңдеу қателігі.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError('Тек .json, .xlsx немесе .csv файлдары қолданылады.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-700/60 rounded-3xl shadow-apple-card text-slate-100 p-6 backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t('importModal.title')}</h2>
              <p className="text-xs text-slate-400">{t('importModal.description')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-8 cursor-pointer bg-slate-800/20 hover:bg-slate-800/50 transition-all text-center group">
          <FileUp className="w-10 h-10 text-slate-500 group-hover:text-emerald-400 transition-colors mb-3" />
          <span className="text-sm font-semibold text-slate-200 group-hover:text-white">
            {t('importModal.dragDrop')}
          </span>
          <span className="text-xs text-slate-500 mt-1">{t('importModal.supported')}</span>
          <input
            type="file"
            accept=".json,.xlsx,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
