import { create } from 'zustand';
import { ShezhirePerson, ZhuzType } from '@/entities/node.types';
import { TreeFilter } from '@/entities/tree.types';
import { INITIAL_SINGLE_ROOT_NODE, HISTORICAL_KAZAKH_PRESET_TREE } from '@/shared/constants/sampleTree';
import { ZHUZ_PRESETS } from '@/entities/node.types';

const LOCAL_STORAGE_KEY = 'shezhire_tree_nodes_v2';

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  nodeId: string | null;
}

interface TreeStore {
  // Tree Nodes Data
  nodes: ShezhirePerson[];
  copiedNode: ShezhirePerson | null;
  layoutOrientation: 'horizontal' | 'vertical';
  
  // History for Undo/Redo
  past: ShezhirePerson[][];
  future: ShezhirePerson[][];

  // UI State
  selectedNodeId: string | null;
  isModalOpen: boolean;
  contextMenu: ContextMenuState;
  lastSavedAt: string | null;
  isSaving: boolean;
  isFinalized: boolean;

  // Filter State
  filter: TreeFilter;

  // Actions
  setNodes: (nodes: ShezhirePerson[]) => void;
  addDescendant: (parentId: string, personData?: Partial<ShezhirePerson>) => ShezhirePerson;
  addSibling: (nodeId: string) => ShezhirePerson | null;
  updateNode: (updatedNode: ShezhirePerson) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  copyNode: (nodeId: string) => void;
  pasteNode: (targetParentId: string) => void;
  changeNodeColor: (nodeId: string, color: string) => void;
  
  // Layout & View
  setLayoutOrientation: (orientation: 'horizontal' | 'vertical') => void;
  
  // Modal & Context Menu
  openEditModal: (nodeId: string) => void;
  closeEditModal: () => void;
  openContextMenu: (x: number, y: number, nodeId: string) => void;
  closeContextMenu: () => void;
  
  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Filter Actions
  setFilter: (newFilter: Partial<TreeFilter>) => void;
  resetFilter: () => void;

  // Storage & Sync
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  resetToSingleRoot: () => void;
  loadPresetKazakhTree: () => void;
  toggleFinalize: () => void;
}

const initialFilter: TreeFilter = {
  searchQuery: '',
  zhuz: 'all',
  clan: 'all',
  gender: 'all',
  lifeStatus: 'all',
};

export const useTreeStore = create<TreeStore>((set, get) => {
  const recordHistory = (currentNodes: ShezhirePerson[]) => {
    const past = [...get().past, currentNodes];
    if (past.length > 30) past.shift();
    return past;
  };

  return {
    nodes: INITIAL_SINGLE_ROOT_NODE,
    copiedNode: null,
    layoutOrientation: 'horizontal',
    past: [],
    future: [],
    selectedNodeId: null,
    isModalOpen: false,
    contextMenu: { isOpen: false, x: 0, y: 0, nodeId: null },
    lastSavedAt: new Date().toLocaleTimeString(),
    isSaving: false,
    isFinalized: false,
    filter: initialFilter,

    setNodes: (nodes) => {
      const past = recordHistory(get().nodes);
      set({ nodes, past, future: [] });
      get().saveToLocalStorage();
    },

    addDescendant: (parentId, personData) => {
      const parent = get().nodes.find((n) => n.id === parentId);
      const parentZhuz: ZhuzType = parent ? parent.zhuz : 'none';
      const defaultColor = ZHUZ_PRESETS[parentZhuz]?.defaultColor || '#00A3E0';

      const newNode: ShezhirePerson = {
        id: `node-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: personData?.name || 'Жаңа ұрпақ',
        description: personData?.description || '',
        birthYear: personData?.birthYear || '',
        deathYear: personData?.deathYear || '',
        gender: personData?.gender || 'male',
        zhuz: parentZhuz,
        clan: parent?.clan || '',
        nodeColor: defaultColor,
        textColor: '#0F172A',
        parentId: parentId,
        comments: [],
        isAlive: true,
        ...personData,
      };

      const past = recordHistory(get().nodes);
      const newNodes = [...get().nodes, newNode];
      set({ nodes: newNodes, past, future: [] });
      get().saveToLocalStorage();

      return newNode;
    },

    addSibling: (nodeId) => {
      const currentNode = get().nodes.find((n) => n.id === nodeId);
      if (!currentNode || !currentNode.parentId) return null;

      return get().addDescendant(currentNode.parentId, {
        name: 'Бауыр',
        zhuz: currentNode.zhuz,
        clan: currentNode.clan,
      });
    },

    updateNode: (updatedNode) => {
      const past = recordHistory(get().nodes);
      const newNodes = get().nodes.map((node) =>
        node.id === updatedNode.id ? updatedNode : node
      );
      set({ nodes: newNodes, past, future: [] });
      get().saveToLocalStorage();
    },

    deleteNode: (nodeId) => {
      const nodeToDelete = get().nodes.find((n) => n.id === nodeId);
      if (!nodeToDelete) return;

      const getDescendantIds = (id: string): string[] => {
        const children = get().nodes.filter((n) => n.parentId === id);
        let ids: string[] = [];
        for (const child of children) {
          ids.push(child.id);
          ids = ids.concat(getDescendantIds(child.id));
        }
        return ids;
      };

      const toDeleteIds = new Set([nodeId, ...getDescendantIds(nodeId)]);
      const past = recordHistory(get().nodes);
      const newNodes = get().nodes.filter((node) => !toDeleteIds.has(node.id));
      
      // If all nodes deleted, restore single root
      const finalNodes = newNodes.length === 0 ? INITIAL_SINGLE_ROOT_NODE : newNodes;

      set({
        nodes: finalNodes,
        past,
        future: [],
        selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
      });
      get().saveToLocalStorage();
    },

    duplicateNode: (nodeId) => {
      const target = get().nodes.find((n) => n.id === nodeId);
      if (!target) return;

      const newNode: ShezhirePerson = {
        ...target,
        id: `node-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: `${target.name} (Көшірме)`,
      };

      const past = recordHistory(get().nodes);
      set({ nodes: [...get().nodes, newNode], past, future: [] });
      get().saveToLocalStorage();
    },

    copyNode: (nodeId) => {
      const target = get().nodes.find((n) => n.id === nodeId);
      if (target) set({ copiedNode: target });
    },

    pasteNode: (targetParentId) => {
      const copied = get().copiedNode;
      if (!copied) return;

      get().addDescendant(targetParentId, {
        name: `${copied.name} (Вставка)`,
        description: copied.description,
        gender: copied.gender,
        zhuz: copied.zhuz,
        clan: copied.clan,
        nodeColor: copied.nodeColor,
      });
    },

    changeNodeColor: (nodeId, color) => {
      const target = get().nodes.find((n) => n.id === nodeId);
      if (target) get().updateNode({ ...target, nodeColor: color });
    },

    setLayoutOrientation: (orientation) => {
      set({ layoutOrientation: orientation });
    },

    openEditModal: (nodeId) => {
      set({ selectedNodeId: nodeId, isModalOpen: true, contextMenu: { isOpen: false, x: 0, y: 0, nodeId: null } });
    },

    closeEditModal: () => {
      set({ isModalOpen: false, selectedNodeId: null });
    },

    openContextMenu: (x, y, nodeId) => {
      set({ contextMenu: { isOpen: true, x, y, nodeId } });
    },

    closeContextMenu: () => {
      set({ contextMenu: { isOpen: false, x: 0, y: 0, nodeId: null } });
    },

    undo: () => {
      const past = [...get().past];
      if (past.length === 0) return;

      const previous = past.pop()!;
      const future = [get().nodes, ...get().future];

      set({ nodes: previous, past, future });
      get().saveToLocalStorage();
    },

    redo: () => {
      const future = [...get().future];
      if (future.length === 0) return;

      const next = future.shift()!;
      const past = [...get().past, get().nodes];

      set({ nodes: next, past, future });
      get().saveToLocalStorage();
    },

    canUndo: () => get().past.length > 0,
    canRedo: () => get().future.length > 0,

    setFilter: (newFilter) => {
      set((state) => ({ filter: { ...state.filter, ...newFilter } }));
    },

    resetFilter: () => {
      set({ filter: initialFilter });
    },

    saveToLocalStorage: () => {
      try {
        set({ isSaving: true });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(get().nodes));
        setTimeout(() => {
          set({ isSaving: false, lastSavedAt: new Date().toLocaleTimeString() });
        }, 300);
      } catch (err) {
        console.error('Failed to save to local storage', err);
        set({ isSaving: false });
      }
    },

    loadFromLocalStorage: () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            set({ nodes: parsed });
            return;
          }
        }
        set({ nodes: INITIAL_SINGLE_ROOT_NODE });
      } catch (err) {
        console.error('Failed to load from local storage', err);
        set({ nodes: INITIAL_SINGLE_ROOT_NODE });
      }
    },

    resetToSingleRoot: () => {
      const past = recordHistory(get().nodes);
      set({ nodes: INITIAL_SINGLE_ROOT_NODE, past, future: [] });
      get().saveToLocalStorage();
    },

    loadPresetKazakhTree: () => {
      const past = recordHistory(get().nodes);
      set({ nodes: HISTORICAL_KAZAKH_PRESET_TREE, past, future: [] });
      get().saveToLocalStorage();
    },

    toggleFinalize: () => {
      set((state) => ({ isFinalized: !state.isFinalized }));
    }
  };
});
