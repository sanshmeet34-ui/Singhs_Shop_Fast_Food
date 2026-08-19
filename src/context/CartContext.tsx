import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Customization, MenuItem } from '@/types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (item: MenuItem, quantity: number, customizations: Customization[]) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const DELIVERY_CHARGE = 2.99;
const FREE_DELIVERY_THRESHOLD = 20;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem, quantity: number, customizations: Customization[]) => {
    const customizationPrice = customizations.reduce((sum, c) => sum + c.price, 0);
    const unitPrice = item.price + customizationPrice;
    const cartId = `${item.id}-${customizations.map((c) => c.name).join(',')}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === cartId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: cartId,
          menu_item_id: item.id,
          name: item.name,
          image: item.image,
          price: unitPrice,
          unitPrice,
          quantity,
          customizations,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, deliveryCharge, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
