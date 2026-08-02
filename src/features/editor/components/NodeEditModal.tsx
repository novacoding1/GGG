import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Save, Trash2 } from 'lucide-react';
import { useTreeStore } from '@/shared/store/treeStore';

export const NodeEditModal: React.FC = () => {
  const { t } = useTranslation();
  const { selectedNodeId, isModalOpen, closeEditModal, nodes, updateNode, deleteNode } = useTreeStore();

  const targetNode = nodes.find((n) => n.id === selectedNodeId);

  const [name, setName] = useState('');

  useEffect(() => {
    if (targetNode) {
      setName(targetNode.name || '');
    }
  }, [targetNode]);

  if (!isModalOpen || !targetNode) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateNode({
        ...targetNode,
        name: name.trim(),
      });
    }
    closeEditModal();
  };

  const handleDelete = () => {
    if (window.confirm(t('modal.deleteConfirm'))) {
      deleteNode(targetNode.id);
      closeEditModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white border border-sky-100 rounded-3xl shadow-2xl text-slate-800 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h2 className="text-base font-bold text-slate-900">Мәтінді өзгерту</h2>
          <button
            onClick={closeEditModal}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* ONLY ONE INPUT FIELD */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Есімі / Мәтіні</label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Есімін жазыңыз..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500 font-bold text-base shadow-inner"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t('node.delete')}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                {t('modal.cancel')}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                {t('modal.save')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
