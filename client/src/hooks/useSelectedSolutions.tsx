import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface SelectedSolutionsContextType {
  selectedIds: string[];
  toggleSolution: (id: string) => void;
  clearSelections: () => void;
  isSelected: (id: string) => boolean;
}

const SelectedSolutionsContext = createContext(null as SelectedSolutionsContextType | null);

function getInitialSelections(): string[] {
  if (typeof window === 'undefined') return [];
  
  const urlParams = new URLSearchParams(window.location.search);
  const urlSolutions = urlParams.get('solutions');
  const urlIds = urlSolutions ? urlSolutions.split(',').filter(Boolean) : [];
  
  try {
    const saved = localStorage.getItem('selected-solutions');
    const savedIds = saved ? JSON.parse(saved) : [];
    
    if (!Array.isArray(savedIds) || !savedIds.every(id => typeof id === 'string')) {
      console.warn('Invalid localStorage data, clearing selections');
      localStorage.removeItem('selected-solutions');
      return urlIds;
    }
    
    const combined = [...new Set([...savedIds, ...urlIds])];
    return combined;
  } catch (error) {
    console.error('Failed to parse localStorage selections:', error);
    localStorage.removeItem('selected-solutions');
    return urlIds;
  }
}

export function SelectedSolutionsProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState(getInitialSelections);

  useEffect(() => {
    localStorage.setItem('selected-solutions', JSON.stringify(selectedIds));
  }, [selectedIds]);

  const toggleSolution = (id: string) => {
    setSelectedIds((prev: string[]) =>
      prev.includes(id) ? prev.filter((sid: string) => sid !== id) : [...prev, id]
    );
  };

  const clearSelections = () => {
    setSelectedIds([]);
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  return (
    <SelectedSolutionsContext.Provider value={{ selectedIds, toggleSolution, clearSelections, isSelected }}>
      {children}
    </SelectedSolutionsContext.Provider>
  );
}

export function useSelectedSolutions() {
  const context = useContext(SelectedSolutionsContext);
  if (!context) {
    throw new Error('useSelectedSolutions must be used within SelectedSolutionsProvider');
  }
  return context;
}
