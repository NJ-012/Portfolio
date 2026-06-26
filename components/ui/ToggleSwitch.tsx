// components/ui/ToggleSwitch.tsx
'use client';

import { useGlobalState } from '@/providers/GlobalStateProvider';
import { motion } from 'framer-motion';

const ToggleSwitch = () => {
  const { isCoreOsMode, setIsCoreOsMode } = useGlobalState();

  return (
    <div className="flex items-center space-x-3 rounded-full border border-gray-800 bg-black/60 p-1 backdrop-blur-md">
      <button
        onClick={() => setIsCoreOsMode(false)}
        className={`rounded-full px-4 py-1.5 font-jetbrains-mono text-xs font-bold uppercase transition-colors ${
          !isCoreOsMode ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        GUI OS
      </button>
      <button
        onClick={() => setIsCoreOsMode(true)}
        className={`rounded-full px-4 py-1.5 font-jetbrains-mono text-xs font-bold uppercase transition-colors ${
          isCoreOsMode ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        Core OS
      </button>
    </div>
  );
};

export default ToggleSwitch;