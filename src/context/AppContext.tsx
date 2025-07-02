import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, ChecklistItem, BudgetItem, ChatMessage, GalleryImage } from '../types';

interface AppState {
  user: User | null;
  checklist: ChecklistItem[];
  budget: BudgetItem[];
  chatMessages: ChatMessage[];
  inspirationImages: GalleryImage[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPGRADE_USER_TIER' }
  | { type: 'TOGGLE_CHECKLIST_ITEM'; payload: string }
  | { type: 'ADD_BUDGET_ITEM'; payload: BudgetItem }
  | { type: 'UPDATE_BUDGET_ITEM'; payload: BudgetItem }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'INITIALIZE_CHECKLIST'; payload: ChecklistItem[] }
  | { type: 'INITIALIZE_BUDGET'; payload: BudgetItem[] }
  | { type: 'ADD_INSPIRATION_IMAGE'; payload: GalleryImage }
  | { type: 'UPDATE_INSPIRATION_IMAGE'; payload: { id: string; updates: Partial<GalleryImage> } }
  | { type: 'DELETE_INSPIRATION_IMAGE'; payload: string };

const initialState: AppState = {
  user: null,
  checklist: [],
  budget: [],
  chatMessages: [],
  inspirationImages: []
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPGRADE_USER_TIER':
      return {
        ...state,
        user: state.user ? { ...state.user, tier: 'pro' } : null
      };
    case 'TOGGLE_CHECKLIST_ITEM':
      return {
        ...state,
        checklist: state.checklist.map(item =>
          item.id === action.payload ? { ...item, completed: !item.completed } : item
        )
      };
    case 'ADD_BUDGET_ITEM':
      return { ...state, budget: [...state.budget, action.payload] };
    case 'UPDATE_BUDGET_ITEM':
      return {
        ...state,
        budget: state.budget.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'INITIALIZE_CHECKLIST':
      return { ...state, checklist: action.payload };
    case 'INITIALIZE_BUDGET':
      return { ...state, budget: action.payload };
    case 'ADD_INSPIRATION_IMAGE':
      return { ...state, inspirationImages: [...state.inspirationImages, action.payload] };
    case 'UPDATE_INSPIRATION_IMAGE':
      return {
        ...state,
        inspirationImages: state.inspirationImages.map(img =>
          img.id === action.payload.id ? { ...img, ...action.payload.updates } : img
        )
      };
    case 'DELETE_INSPIRATION_IMAGE':
      return {
        ...state,
        inspirationImages: state.inspirationImages.filter(img => img.id !== action.payload)
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}