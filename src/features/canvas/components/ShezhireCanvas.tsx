import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useTreeStore } from '@/shared/store/treeStore';
import { ShezhireCustomNode } from './ShezhireCustomNode';
import { ContextMenu } from './ContextMenu';
import { getLayoutedElements } from '@/shared/lib/layoutTree';
import { CanvasToolbar } from '@/shared/ui/CanvasToolbar';
import { FilterBar } from '@/features/filter/components/FilterBar';

const nodeTypes = {
  shezhireNode: ShezhireCustomNode,
};

export const ShezhireCanvas: React.FC = () => {
  const {
    nodes: storeNodes,
    layoutOrientation,
    filter,
    undo,
    redo,
    deleteNode,
    copyNode,
    pasteNode,
    closeContextMenu,
    selectedNodeId,
  } = useTreeStore();

  const [isMinimapVisible, setIsMinimapVisible] = useState(true);
  const { fitView } = useReactFlow();

  // Filter nodes based on search query, zhuz, gender, etc.
  const filteredNodes = useMemo(() => {
    return storeNodes.filter((person) => {
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const nameMatch = person.name.toLowerCase().includes(query);
        const clanMatch = person.clan?.toLowerCase().includes(query) || false;
        const descMatch = person.description?.toLowerCase().includes(query) || false;
        const yearMatch = person.birthYear?.includes(query) || person.deathYear?.includes(query) || false;
        if (!nameMatch && !clanMatch && !descMatch && !yearMatch) return false;
      }

      if (filter.zhuz !== 'all' && person.zhuz !== filter.zhuz) {
        return false;
      }

      if (filter.gender !== 'all' && person.gender !== filter.gender) {
        return false;
      }

      return true;
    });
  }, [storeNodes, filter]);

  // Layout calculations
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(filteredNodes, layoutOrientation);
  }, [filteredNodes, layoutOrientation]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ duration: 500, padding: 0.25 });
    }, 100);
    return () => clearTimeout(timer);
  }, [layoutOrientation, filteredNodes.length, fitView]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (selectedNodeId) {
          e.preventDefault();
          copyNode(selectedNodeId);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        if (selectedNodeId) {
          e.preventDefault();
          pasteNode(selectedNodeId);
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          e.preventDefault();
          deleteNode(selectedNodeId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedNodeId, copyNode, pasteNode, deleteNode]);

  const handlePaneClick = useCallback(() => {
    closeContextMenu();
  }, [closeContextMenu]);

  return (
    <div id="shezhire-canvas" className="relative w-full h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Top Search & Filter Floating Bar */}
      <div className="absolute top-20 left-4 z-30 pointer-events-auto">
        <FilterBar />
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onPaneClick={handlePaneClick}
        fitView
        minZoom={0.1}
        maxZoom={2.5}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#00A3E0', strokeWidth: 3 },
        }}
        proOptions={{ hideAttribution: true }}
        className="touch-none"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="rgba(0, 163, 224, 0.18)"
        />

        {isMinimapVisible && (
          <MiniMap
            nodeColor={(n) => {
              const p = n.data as any;
              return p.nodeColor || '#00A3E0';
            }}
            maskColor="rgba(248, 250, 252, 0.8)"
            className="!bg-white !border-sky-200 !rounded-2xl !bottom-20 !right-6 overflow-hidden shadow-xl"
          />
        )}
      </ReactFlow>

      {/* Bottom Floating Canvas Toolbar */}
      <CanvasToolbar
        isMinimapVisible={isMinimapVisible}
        onToggleMinimap={() => setIsMinimapVisible(!isMinimapVisible)}
      />

      {/* Right Click Context Menu */}
      <ContextMenu />
    </div>
  );
};
