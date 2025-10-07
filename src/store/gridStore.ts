import { create } from 'zustand';
import { GridState, GridItem, GridConfig, GridHistoryState, Breakpoint } from '@/types';
import { generateId } from '@/lib/utils';

const MAX_HISTORY = 50;

const defaultConfig: GridConfig = {
  columns: 12,
  rows: 8,
  gap: 8,
  gapUnit: 'px',
  gapItems: 8, // Gap par défaut pour les items (8px)
  padding: 16,
  paddingUnit: 'px',
  containerWidth: 100,
  containerWidthUnit: '%',
  columnWidths: Array(12).fill(1), // Par défaut, toutes les colonnes font 1fr
  rowHeights: Array(8).fill(1), // Par défaut, toutes les lignes font 1fr
};

interface GridStore extends GridState {
  // Actions
  setConfig: (config: Partial<GridConfig>) => void;
  setColumnWidth: (index: number, width: number) => void;
  setRowHeight: (index: number, height: number) => void;
  resetColumnWidths: () => void;
  resetRowHeights: () => void;
  addItem: (item?: Partial<GridItem>) => void;
  updateItem: (id: string, updates: Partial<GridItem>) => void;
  deleteItem: (id: string) => void;
  selectItem: (id: string | null) => void;
  duplicateItem: (id: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;
  loadState: (state: Partial<GridState>) => void;
  reset: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrentBreakpoint: (bp: Breakpoint) => void;
}

const saveState = (): GridHistoryState => {
  const state = useGridStore.getState();
  return {
    config: { ...state.config },
    items: state.items.map(item => ({ ...item })),
  };
};

const loadFromHistory = (historyState: GridHistoryState) => {
  useGridStore.setState({
    config: historyState.config,
    items: historyState.items,
  });
};

export const useGridStore = create<GridStore>((set, get) => ({
  config: defaultConfig,
  items: [],
  selectedItemId: null,
  history: {
    past: [],
    future: [],
  },
  theme: 'light',
  currentBreakpoint: 'base',

  setConfig: (updates) => {
    get().saveToHistory();
    set((state) => {
      const newConfig = { ...state.config, ...updates };
      
      // Si le nombre de colonnes change, adapter le tableau columnWidths
      if (updates.columns !== undefined && updates.columns !== state.config.columns) {
        const oldWidths = state.config.columnWidths || [];
        const newWidths = Array(updates.columns).fill(1);
        
        // Copier les anciennes valeurs si elles existent
        for (let i = 0; i < Math.min(oldWidths.length, updates.columns); i++) {
          newWidths[i] = oldWidths[i];
        }
        
        newConfig.columnWidths = newWidths;
      }
      
      // Si le nombre de lignes change, adapter le tableau rowHeights
      if (updates.rows !== undefined && updates.rows !== state.config.rows) {
        const oldHeights = state.config.rowHeights || [];
        const newHeights = Array(updates.rows).fill(1);
        
        // Copier les anciennes valeurs si elles existent
        for (let i = 0; i < Math.min(oldHeights.length, updates.rows); i++) {
          newHeights[i] = oldHeights[i];
        }
        
        newConfig.rowHeights = newHeights;
      }
      
      return { config: newConfig };
    });
  },

  setColumnWidth: (index, width) => {
    const validWidth = width > 0 ? width : 1;
    console.log(`🔴 STORE setColumnWidth(${index}, ${width}) → ${validWidth}`);
    set((state) => {
      const newWidths = [...state.config.columnWidths];
      const oldValue = newWidths[index];
      newWidths[index] = validWidth;
      console.log(`🔴 STORE columnWidths[${index}]: ${oldValue} → ${validWidth}`);
      console.log(`🔴 STORE nouveau tableau:`, newWidths);
      return {
        ...state,
        config: { ...state.config, columnWidths: newWidths },
      };
    });
  },

  setRowHeight: (index, height) => {
    const validHeight = height > 0 ? height : 1;
    console.log(`🟣 STORE setRowHeight(${index}, ${height}) → ${validHeight}`);
    set((state) => {
      const newHeights = [...state.config.rowHeights];
      const oldValue = newHeights[index];
      newHeights[index] = validHeight;
      console.log(`🟣 STORE rowHeights[${index}]: ${oldValue} → ${validHeight}`);
      return {
        ...state,
        config: { ...state.config, rowHeights: newHeights },
      };
    });
  },

  resetColumnWidths: () => {
    get().saveToHistory();
    set((state) => ({
      config: {
        ...state.config,
        columnWidths: Array(state.config.columns).fill(1),
      },
    }));
  },

  resetRowHeights: () => {
    get().saveToHistory();
    set((state) => ({
      config: {
        ...state.config,
        rowHeights: Array(state.config.rows).fill(1),
      },
    }));
  },

  addItem: (itemData) => {
    get().saveToHistory();
    const { config, items } = get();
    const newItem: GridItem = {
      id: generateId(),
      startCol: 1,
      endCol: Math.min(4, config.columns + 1),
      startRow: 1,
      endRow: Math.min(3, config.rows + 1),
      ...itemData,
    };
    set({ items: [...items, newItem], selectedItemId: newItem.id });
  },

  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  deleteItem: (id) => {
    get().saveToHistory();
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    }));
  },

  selectItem: (id) => {
    set({ selectedItemId: id });
  },

  duplicateItem: (id) => {
    get().saveToHistory();
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    
    const newItem: GridItem = {
      ...item,
      id: generateId(),
      startCol: Math.min(item.startCol + 1, get().config.columns),
      startRow: Math.min(item.startRow + 1, get().config.rows),
      endCol: Math.min(item.endCol + 1, get().config.columns + 1),
      endRow: Math.min(item.endRow + 1, get().config.rows + 1),
    };
    
    set((state) => ({
      items: [...state.items, newItem],
      selectedItemId: newItem.id,
    }));
  },

  saveToHistory: () => {
    const currentState = saveState();
    set((state) => ({
      history: {
        past: [...state.history.past.slice(-MAX_HISTORY + 1), currentState],
        future: [],
      },
    }));
  },

  undo: () => {
    const { history } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const current = saveState();

    loadFromHistory(previous);
    
    set((state) => ({
      history: {
        past: state.history.past.slice(0, -1),
        future: [current, ...state.history.future],
      },
    }));
  },

  redo: () => {
    const { history } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const current = saveState();

    loadFromHistory(next);
    
    set((state) => ({
      history: {
        past: [...state.history.past, current],
        future: state.history.future.slice(1),
      },
    }));
  },

  canUndo: () => get().history.past.length > 0,
  canRedo: () => get().history.future.length > 0,

  loadState: (state) => {
    set((prev) => {
      const newState = {
        ...prev,
        ...state,
        history: { past: [], future: [] },
      };
      
      // Si columnWidths n'existe pas, l'initialiser
      if (newState.config && !newState.config.columnWidths) {
        newState.config.columnWidths = Array(newState.config.columns).fill(1);
      }
      
      // Si rowHeights n'existe pas, l'initialiser
      if (newState.config && !newState.config.rowHeights) {
        newState.config.rowHeights = Array(newState.config.rows).fill(1);
      }
      
      return newState;
    });
  },

  reset: () => {
    set({
      config: defaultConfig,
      items: [],
      selectedItemId: null,
      history: { past: [], future: [] },
    });
  },

  setTheme: (theme) => {
    set({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setCurrentBreakpoint: (bp) => {
    set({ currentBreakpoint: bp });
  },
}));

// Initialiser le thème au chargement
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  useGridStore.getState().setTheme('dark');
}

