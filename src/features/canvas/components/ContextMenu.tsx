import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Edit3, Trash2 } from 'lucide-react';
import { useTreeStore } from '@/shared/store/treeStore';

export const ContextMenu: React.FC = () => {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    contextMenu,
    closeContextMenu,
    addDescendant,
    openEditModal,
    deleteNode,
  } = useTreeStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };
    if (contextMenu.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu.isOpen, closeContextMenu]);

  if (!contextMenu.isOpen || !contextMenu.nodeId) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
      className="fixed z-50 min-w-[180px] bg-white/95 backdrop-blur-xl border border-sky-100 rounded-2xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150 select-none text-slate-800"
    >
      <div className="py-0.5 space-y-0.5">
        {/* Add Descendant */}
        <button
          onClick={() => {
            addDescendant(contextMenu.nodeId!);
            closeContextMenu();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-sky-50 text-sky-700 font-bold transition-colors"
        >
          <UserPlus className="w-4 h-4 text-sky-600" />
          <span>{t('node.addDescendant')}</span>
        </button>

        {/* Edit */}
        <button
          onClick={() => {
            openEditModal(contextMenu.nodeId!);
            closeContextMenu();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-slate-100 transition-colors font-medium"
        >
          <Edit3 className="w-4 h-4 text-slate-600" />
          <span>Мәтінді өңдеу</span>
        </button>

        {/* Delete */}
        <button
          onClick={() => {
            deleteNode(contextMenu.nodeId!);
            closeContextMenu();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-red-50 text-red-600 font-semibold transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t('node.delete')}</span>
        </button>
      </div>
    </div>
  );
};
