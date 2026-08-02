import React, { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Header } from '@/shared/ui/Header';
import { ShezhireCanvas } from '@/features/canvas/components/ShezhireCanvas';
import { NodeEditModal } from '@/features/editor/components/NodeEditModal';
import { useTreeStore } from '@/shared/store/treeStore';
import '@/features/i18n';

export const App: React.FC = () => {
  const { loadFromLocalStorage, saveToLocalStorage } = useTreeStore();

  useEffect(() => {
    loadFromLocalStorage();

    // Auto-save every 5 seconds
    const interval = setInterval(() => {
      saveToLocalStorage();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadFromLocalStorage, saveToLocalStorage]);

  return (
    <ReactFlowProvider>
      <div className="relative w-full h-screen bg-[#F8FAFC] overflow-hidden">
        {/* Top Header Navbar */}
        <Header />

        {/* Main Canvas Graph Editor */}
        <ShezhireCanvas />

        {/* Node Editor Glassmorphic Modal */}
        <NodeEditModal />
      </div>
    </ReactFlowProvider>
  );
};

export default App;
