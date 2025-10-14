
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: 'kg' | 'unidade';
  image: string; // base64 encoded image
}

export interface CartItem extends Product {
  quantity: number;
  notes: string;
}

export interface OrderDetails {
  name: string;
  address: string;
  phone: string;
  paymentMethod: 'pix' | 'card' | 'cash';
}

export interface AppContextType {
  products: Product[];
  cart: CartItem[];
  isAdminAuthenticated: boolean;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addToCart: (product: Product, quantity: number, notes: string) => void;
  updateCartItem: (productId: string, quantity: number, notes: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  login: (password: string) => boolean;
  logout: () => void;
}
