import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

export interface EcoPointsTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  collectionId?: string;
  orderId?: string;
  date: string;
}

export interface EcoPointsState {
  balance: number;
  transactions: EcoPointsTransaction[];
  totalEarned: number;
  totalSpent: number;
}

type EcoPointsAction =
  | { type: 'SET_BALANCE'; payload: number }
  | { type: 'ADD_TRANSACTION'; payload: EcoPointsTransaction }
  | { type: 'LOAD_STATE'; payload: EcoPointsState }
  | { type: 'RESET_STATE' };

const initialState: EcoPointsState = {
  balance: 0,
  transactions: [],
  totalEarned: 0,
  totalSpent: 0,
};

function ecoPointsReducer(state: EcoPointsState, action: EcoPointsAction): EcoPointsState {
  switch (action.type) {
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };

    case 'ADD_TRANSACTION': {
      const newTransaction = action.payload;
      const newTransactions = [newTransaction, ...state.transactions];
      
      let newBalance = state.balance;
      let newTotalEarned = state.totalEarned;
      let newTotalSpent = state.totalSpent;
      
      if (newTransaction.type === 'earned') {
        newBalance += newTransaction.amount;
        newTotalEarned += newTransaction.amount;
      } else {
        newBalance -= newTransaction.amount;
        newTotalSpent += newTransaction.amount;
      }

      return {
        ...state,
        balance: newBalance,
        transactions: newTransactions,
        totalEarned: newTotalEarned,
        totalSpent: newTotalSpent,
      };
    }

    case 'LOAD_STATE':
      return action.payload;

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

interface EcoPointsContextType {
  state: EcoPointsState;
  earnPoints: (amount: number, description: string, collectionId?: string) => void;
  spendPoints: (amount: number, description: string, orderId?: string) => boolean;
  getTransactionHistory: () => EcoPointsTransaction[];
  canAfford: (amount: number) => boolean;
}

const EcoPointsContext = createContext<EcoPointsContextType | undefined>(undefined);

export function EcoPointsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ecoPointsReducer, initialState);
  const { toast } = useToast();
  const { user } = useAuth();

  // Cargar estado desde localStorage al inicializar
  useEffect(() => {
    if (user) {
      const savedState = localStorage.getItem(`ecopoints-${user.id}`);
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          dispatch({ type: 'LOAD_STATE', payload: parsedState });
        } catch (error) {
          console.error('Error loading EcoPoints state:', error);
        }
      } else {
        // Cargar puntos iniciales del usuario si existen
        if (user.points) {
          dispatch({ type: 'SET_BALANCE', payload: user.points });
        }
      }
    }
  }, [user]);

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem(`ecopoints-${user.id}`, JSON.stringify(state));
    }
  }, [state, user]);

  const earnPoints = (amount: number, description: string, collectionId?: string) => {
    const transaction: EcoPointsTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'earned',
      amount,
      description,
      collectionId,
      date: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    toast({
      title: "¡EcoPuntos ganados!",
      description: `Has ganado ${amount} EcoPuntos por ${description}`,
      variant: "default",
    });
  };

  const spendPoints = (amount: number, description: string, orderId?: string): boolean => {
    if (state.balance < amount) {
      toast({
        title: "EcoPuntos insuficientes",
        description: `Necesitas ${amount} EcoPuntos pero solo tienes ${state.balance}`,
        variant: "destructive",
      });
      return false;
    }

    const transaction: EcoPointsTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'spent',
      amount,
      description,
      orderId,
      date: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    toast({
      title: "EcoPuntos utilizados",
      description: `Has gastado ${amount} EcoPuntos en ${description}`,
      variant: "default",
    });

    return true;
  };

  const getTransactionHistory = (): EcoPointsTransaction[] => {
    return state.transactions;
  };

  const canAfford = (amount: number): boolean => {
    return state.balance >= amount;
  };

  const value: EcoPointsContextType = {
    state,
    earnPoints,
    spendPoints,
    getTransactionHistory,
    canAfford,
  };

  return (
    <EcoPointsContext.Provider value={value}>
      {children}
    </EcoPointsContext.Provider>
  );
}

export function useEcoPoints() {
  const context = useContext(EcoPointsContext);
  if (context === undefined) {
    throw new Error('useEcoPoints must be used within an EcoPointsProvider');
  }
  return context;
}