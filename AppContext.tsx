
import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, CartItem, AppContextType } from '../types';
import toast from 'react-hot-toast';

const initialProducts: Product[] = [
    { id: '1', name: 'Maçã Fuji', description: 'Maçãs Fuji frescas e crocantes, perfeitas para um lanche saudável.', price: 8.99, unit: 'kg', image: 'https://picsum.photos/seed/apple/400/400' },
    { id: '2', name: 'Banana Prata', description: 'Bananas Prata maduras, ricas em potássio e energia.', price: 5.49, unit: 'kg', image: 'https://picsum.photos/seed/banana/400/400' },
    { id: '3', name: 'Alface Crespa', description: 'Alface crespa, fresca e orgânica, ideal para saladas.', price: 3.50, unit: 'unidade', image: 'https://picsum.photos/seed/lettuce/400/400' },
    { id: '4', name: 'Tomate Italiano', description: 'Tomates italianos suculentos, ótimos para molhos e saladas.', price: 9.90, unit: 'kg', image: 'https://picsum.photos/seed/tomato/400/400' },
    { id: '5', name: 'Cenoura', description: 'Cenouras frescas, ricas em vitamina A.', price: 4.20, unit: 'kg', image: 'https://picsum.photos/seed/carrot/400/400' },
    { id: '6', name: 'Brócolis', description: 'Brócolis ninja, cheio de nutrientes e sabor.', price: 7.00, unit: 'unidade', image: 'https://picsum.photos/seed/broccoli/400/400' },
];


const AppContext = createContext<AppContextType | undefined>(undefined);

type AppState = {
  products: Product[];
  cart: CartItem[];
  isAdminAuthenticated: boolean;
};

type Action =
  | { type: 'SET_INITIAL_STATE'; payload: AppState }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { product: Product, quantity: number, notes: string } }
  | { type: 'UPDATE_CART_ITEM'; payload: { productId: string, quantity: number, notes: string } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' };

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
      return action.payload;
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p),
      };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    case 'ADD_TO_CART': {
      const { product, quantity, notes } = action.payload;
      const existingItem = state.cart.find(item => item.id === product.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes } : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, { ...product, quantity, notes }] };
    }
    case 'UPDATE_CART_ITEM': {
        const { productId, quantity, notes } = action.payload;
        if (quantity <= 0) {
            return { ...state, cart: state.cart.filter(item => item.id !== productId) };
        }
        return {
            ...state,
            cart: state.cart.map(item => item.id === productId ? { ...item, quantity, notes } : item)
        };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'CLEAR_CART':
        return { ...state, cart: [] };
    case 'LOGIN':
        return { ...state, isAdminAuthenticated: true };
    case 'LOGOUT':
        return { ...state, isAdminAuthenticated: false };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, {
    products: [],
    cart: [],
    isAdminAuthenticated: false,
  });

  useEffect(() => {
    try {
      const storedState = localStorage.getItem('greenSpotState');
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        dispatch({ type: 'SET_INITIAL_STATE', payload: { ...parsedState, isAdminAuthenticated: false } }); // Always start logged out
      } else {
        dispatch({ type: 'SET_INITIAL_STATE', payload: { products: initialProducts, cart: [], isAdminAuthenticated: false } });
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      dispatch({ type: 'SET_INITIAL_STATE', payload: { products: initialProducts, cart: [], isAdminAuthenticated: false } });
    }
  }, []);

  useEffect(() => {
    try {
      const stateToStore = JSON.stringify({ products: state.products, cart: state.cart });
      localStorage.setItem('greenSpotState', stateToStore);
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [state.products, state.cart]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: new Date().toISOString() };
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    toast.success(`${product.name} adicionado com sucesso!`);
  };

  const updateProduct = (product: Product) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    toast.success(`${product.name} atualizado com sucesso!`);
  };

  const deleteProduct = (productId: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    toast.error('Produto removido.');
  };

  const addToCart = (product: Product, quantity: number, notes: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, notes } });
    toast.success(`${quantity} x ${product.name} adicionado ao carrinho!`);
  };

  const updateCartItem = (productId: string, quantity: number, notes: string) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { productId, quantity, notes } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    toast.error('Item removido do carrinho.');
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const login = (password: string): boolean => {
    if (password === '4321') {
      dispatch({ type: 'LOGIN' });
      toast.success('Login bem-sucedido!');
      return true;
    }
    toast.error('Senha incorreta!');
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Você foi desconectado.');
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
