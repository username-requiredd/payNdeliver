"use client";

import { useSession } from "next-auth/react";
import { useState, useContext, createContext, useEffect, useMemo, useCallback } from "react";
import useLocalStorage from "./uselocalstorage";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useLocalStorage("cart", []);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch cart from the database when the user is authenticated
  const fetchCart = useCallback(async () => {
    const id = session?.user?.id;
    if (!id) {
      console.warn("User not authenticated. Cannot fetch cart.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log("Fetching cart for user:", id);

      const response = await fetch(`/api/cart/${id}`);

      if (!response.ok) {
        throw new Error("Error fetching cart data!");
      }

      const { products } = await response.json();
      console.log("Fetched products from API:", products);

      // Update local cart with fetched products
      setCart(products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: product.image
      })));

    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, setCart]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchCart();
    } else {
      setCart([]);  // Clear cart when user logs out
    }
  }, [fetchCart, session?.user?.id, setCart]);

  // Save cart to the database
  const saveCartToDb = useCallback(async (products) => {
    const userId = session?.user?.id;
    if (!userId) {
      console.warn("User not authenticated. Cannot save cart to database.");
      return;
    }

    try {
      setLoading(true);
      console.log("Saving cart to database for user:", userId);
      const response = await fetch(`/api/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          products: products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            image: product.image
          })),
          total: products.reduce((acc, product) => acc + (product.price * product.quantity), 0)
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

      const data = await response.json();
      console.log("Cart updated successfully in the database:", data);
    } catch (error) {
      console.error("Error updating cart in the database:", error);
      setError("Error updating cart");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Add a product to the cart
  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const productExist = prevCart.find((item) => item.id === product.id);
      let updatedCart;

      if (productExist) {
        updatedCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }

      console.log("Cart after adding product:", updatedCart);
      saveCartToDb(updatedCart);

      return updatedCart;
    });
  }, [setCart, saveCartToDb]);

  // Remove a product from the cart
  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      console.log("Cart after removing product:", updatedCart);
      saveCartToDb(updatedCart);

      return updatedCart;
    });
  }, [setCart, saveCartToDb]);

  // Clear the cart
  const clearCart = useCallback(() => {
    setCart([]);
    console.log("Cleared cart.");
    saveCartToDb([]);
  }, [setCart, saveCartToDb]);

  // Update product quantity in the cart
  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(productId);
    }
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      console.log(`Updated quantity for product ${productId}:`, updatedCart);
      saveCartToDb(updatedCart);

      return updatedCart;
    });
  }, [setCart, saveCartToDb, removeFromCart]);

  // Memoized context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      loading,
      error,
    }),
    [cart, addToCart, removeFromCart, clearCart, updateQuantity, loading, error]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};