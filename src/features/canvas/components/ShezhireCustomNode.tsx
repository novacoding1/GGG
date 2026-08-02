import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Plus } from 'lucide-react';
import { ShezhirePerson, ZHUZ_PRESETS } from '@/entities/node.types';
import { useTreeStore } from '@/shared/store/treeStore';

export const ShezhireCustomNode: React.FC<NodeProps> = memo(({ id, data, targetPosition, sourcePosition, selected }) => {
  const person = data as unknown as ShezhirePerson;
  const { addDescendant, openEditModal, openContextMenu, layoutOrientation } = useTreeStore();

  const isHorizontal = layoutOrientation === 'horizontal';
  const zhuzInfo = ZHUZ_PRESETS[person.zhuz || 'none'];
  const borderColor = person.nodeColor || zhuzInfo?.defaultColor || '#00A3E0';

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    addDescendant(id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openContextMenu(e.clientX, e.clientY, id);
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditModal(id);
  };

  return (
    <div className="relative flex flex-col items-center group">
      {/* Pure Circle Node Card with ONLY TEXT */}
      <div
        onContextMenu={handleContextMenu}
        onClick={handleNodeClick}
        className={`relative flex items-center justify-center min-w-[130px] min-h-[56px] px-6 py-3 rounded-full cursor-pointer transition-all duration-300 bg-white border-2 select-none shadow-sm ${
          selected
            ? 'ring-4 ring-amber-400 ring-offset-2 scale-105 shadow-gold-glow border-amber-400'
            : 'hover:scale-105 hover:shadow-kazakh-glow'
        }`}
        style={{
          borderColor: selected ? '#F59E0B' : borderColor,
        }}
      >
        {/* Target Handle */}
        <Handle
          type="target"
          position={targetPosition || (isHorizontal ? Position.Left : Position.Top)}
          className="!bg-sky-500 !w-3 !h-3 !border-2 !border-white"
        />

        {/* ONLY TEXT inside circle */}
        <span className="font-bold text-sm text-slate-900 tracking-wide text-center truncate max-w-[180px]">
          {person.name}
        </span>

        {/* Source Handle */}
        <Handle
          type="source"
          position={sourcePosition || (isHorizontal ? Position.Right : Position.Bottom)}
          className="!bg-amber-400 !w-3 !h-3 !border-2 !border-white"
        />
      </div>

      {/* Plus (+) Button directly below circle */}
      <button
        onClick={handleAddChild}
        title="Потомок қосу (+)"
        className="mt-2 relative z-10 flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-sm transition-all duration-200 hover:scale-125 border-2 border-white group/btn"
      >
        <Plus className="w-4 h-4 transition-transform duration-200 group-hover/btn:rotate-90" />
      </button>
    </div>
  );
});

ShezhireCustomNode.displayName = 'ShezhireCustomNode';
