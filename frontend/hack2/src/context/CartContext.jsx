import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      setCart(response.data.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    } else {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) setCart(JSON.parse(storedCart));
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated()) {
      try {
        await api.post("/cart/add", { productId: product.id, quantity });
        await fetchCart();
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      }
    } else {
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        if (existing) {
          return prev.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, productId: product.id, quantity }];
      });
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated()) {
      try {
        await api.put(`/cart/update/${itemId}`, { quantity });
        await fetchCart();
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.productId === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated()) {
      try {
        await api.delete(`/cart/remove/${itemId}`);
        await fetchCart();
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    } else {
      setCart((prev) => prev.filter((item) => item.productId !== itemId));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated()) {
      try {
        await api.delete("/cart/clear");
        setCart([]);
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    } else {
      setCart([]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
