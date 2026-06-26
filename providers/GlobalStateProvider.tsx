// providers/GlobalStateProvider.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface GlobalStateContextType {
  isCoreOsMode: boolean;
  setIsCoreOsMode: Dispatch<SetStateAction<boolean>>;
  activeHoveredSkill: string | null;
  setActiveHoveredSkill: Dispatch<SetStateAction<string | null>>;
  cubeScrollProgress: number;
  setCubeScrollProgress: Dispatch<SetStateAction<number>>;
  isDealt: boolean;
  setIsDealt: Dispatch<SetStateAction<boolean>>;
  selectedTechStackCategory: import('@/lib/constants').SkillCategory;
  setSelectedTechStackCategory: Dispatch<SetStateAction<import('@/lib/constants').SkillCategory>>;
}


const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [isCoreOsMode, setIsCoreOsMode] = useState<boolean>(false);
  const [activeHoveredSkill, setActiveHoveredSkill] = useState<string | null>(null);
  const [cubeScrollProgress, setCubeScrollProgress] = useState<number>(0);
  const [isDealt, setIsDealt] = useState<boolean>(false);
  const [selectedTechStackCategory, setSelectedTechStackCategory] = useState<import('@/lib/constants').SkillCategory>('Full-Stack Web');


  return (
    <GlobalStateContext.Provider
      value={{
        isCoreOsMode,
        setIsCoreOsMode,
        activeHoveredSkill,
        setActiveHoveredSkill,
        cubeScrollProgress,
        setCubeScrollProgress,
        isDealt,
        setIsDealt,
        selectedTechStackCategory,
        setSelectedTechStackCategory,
      }}

    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};