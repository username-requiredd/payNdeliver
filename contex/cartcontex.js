"use client";

import { useSession } from "next-auth/react";
import { useState, useContext, createContext, useEffect, useMemo, useCallback } from "react";
import useLocalStorage from "./uselocalstorage";

const CartContext = createContext();

const validateProduct = (product) => {
  const required = ['id', 'name', 'price', 'quantity', 'image'];
  for (const field of required) {
    if (!product[field] && product[field] !== 0) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return {
    id: String(product.id || product._id),
    name: String(product.name),
    price: Number(product.price),
    quantity: Math.max(1, Number(product.quantity)),
    image: String(product.image)
  };
};

const calculateTotal = (products) => {
  return products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useLocalStorage("cart", []);
  const { data: session, status } = useSession(); // Added status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchCart = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/cart/${userId}`);
      if (!response.ok) {
        throw new Error("Error fetching cart data!");
      }

      const { products } = await response.json();
      
      if (products && products.length > 0) {
        const validatedProducts = products.map(product => validateProduct({
          id: product._id || product.id,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          image: product.image
        }));

        // Only update if there's no existing cart data
        setCart(prevCart => prevCart.length === 0 ? validatedProducts : prevCart);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [session?.user?.id, setCart]);

  // Modified useEffect to handle initialization
  useEffect(() => {
    // Only fetch cart if we're authenticated and not initialized
    if (status === "authenticated" && !isInitialized) {
      fetchCart();
    }
    // If we're not authenticated but initialized, keep the local cart
  }, [status, fetchCart, isInitialized]);

  const saveCartToDb = useCallback(async (products) => {
    const userId = session?.user?.id;
    if (!userId) {
      // If not authenticated, just keep in localStorage
      return;
    }

    try {
      setLoading(true);
      const validatedProducts = products.map(validateProduct);
      const total = calculateTotal(validatedProducts);

      const response = await fetch(`/api/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          products: validatedProducts,
          total
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating cart in the database:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const addToCart = useCallback((product) => {
    try {
      const validatedProduct = validateProduct(product);
      
      setCart((prevCart) => {
        const productExist = prevCart.find((item) => item.id === validatedProduct.id);
        let updatedCart;

        if (productExist) {
          updatedCart = prevCart.map((item) =>
            item.id === validatedProduct.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedCart = [...prevCart, { ...validatedProduct, quantity: 1 }];
        }

        // Save to DB if authenticated
        if (session?.user?.id) {
          saveCartToDb(updatedCart);
        }
        return updatedCart;
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setError(error.message);
    }
  }, [setCart, saveCartToDb, session?.user?.id]);

  const removeFromCart = useCallback((productId) => {
    try {
      setCart((prevCart) => {
        const updatedCart = prevCart.filter((item) => item.id !== productId);
        if (session?.user?.id) {
          saveCartToDb(updatedCart);
        }
        return updatedCart;
      });
    } catch (error) {
      console.error("Error removing product from cart:", error);
      setError(error.message);
    }
  }, [setCart, saveCartToDb, session?.user?.id]);

  const clearCart = useCallback(() => {
    try {
      setCart([]);
      if (session?.user?.id) {
        saveCartToDb([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError(error.message);
    }
  }, [setCart, saveCartToDb, session?.user?.id]);

  const contextValue = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      loading,
      error,
    }),
    [cart, addToCart, removeFromCart, clearCart, loading, error]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};