"use client";

import { useSession } from "next-auth/react";
import { useState, useContext, createContext, useEffect, useMemo, useCallback } from "react";
import useLocalStorage from "./uselocalstorage";

const CartContext = createContext();

// Validation functions
const validateProduct = (product) => {
  const required = [ 'name', 'price', 'quantity', 'image'];
  for (const field of required) {
    if (!product[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return {
    _id: String(product._id ),
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
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCart = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) {
      console.warn("User not authenticated. Cannot fetch cart.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log("Fetching cart for user:", userId);

      const response = await fetch(`/api/cart/${userId}`);

      if (!response.ok) {
        throw new Error("Error fetching cart data!");
      }

      const { products } = await response.json();
      console.log("Fetched products from API:", products);

      // Validate and transform fetched products
      // const test = products.map((product)=> product)
      // console.log("test:", test)
      const validatedProducts = products.map(product => validateProduct({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: product.image
      }));


      console.log("validated products:", validatedProducts)

      setCart(validatedProducts);

    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [session?.user?.id, fetchCart]);

  const saveCartToDb = useCallback(async (products) => {
    const userId = session?.user?.id;
    if (!userId) {
      console.warn("User not authenticated. Cannot save cart to database.");
      return;
    }

    try {
      setLoading(true);
      console.log("Saving cart to database for user:", userId);

      // Validate all products before saving
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

      const data = await response.json();
      console.log("Cart updated successfully in the database:", data);
    } catch (error) {
      console.error("Error updating cart in the database:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);
  

  const addToCart = useCallback((product) => {
    // console.log("products form add to cart function", product)
    try {
      const validatedProduct = validateProduct(product);
      console.log("validated products",validateProduct)
      setCart((prevCart) => {
        const productExist = prevCart.find((item) => item.id === validatedProduct.id);
        let updatedCart;

        if (productExist) {
          updatedCart = prevCart.map((item) =>
            item.id === validatedProduct._id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedCart = [...prevCart, { ...validatedProduct, quantity: 1 }];
        }

        console.log("Cart after adding product:", updatedCart);
        saveCartToDb(updatedCart);

        return updatedCart;
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setError(error.message);
    }
  }, [setCart, saveCartToDb]);

  const removeFromCart = useCallback((productId) => {
    try {
      setCart((prevCart) => {
        const updatedCart = prevCart.filter((item) => item.id !== productId);
        console.log("Cart after removing product:", updatedCart);
        saveCartToDb(updatedCart);

        return updatedCart;
      });
    } catch (error) {
      console.error("Error removing product from cart:", error);
      setError(error.message);
    }
  }, [setCart, saveCartToDb]);

  const clearCart = useCallback(() => {
    try {
      setCart([]);
      console.log("Cleared cart.");
      saveCartToDb([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError(error.message);
    }
  }, [setCart, saveCartToDb]);

  const updateQuantity = useCallback((productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        return removeFromCart(productId);
      }

      setCart((prevCart) => {
        const updatedCart = prevCart.map((item) =>
          item.id === productId
            ? validateProduct({ ...item, quantity: newQuantity })
            : item
        );
        console.log(`Updated quantity for product ${productId}:`, updatedCart);
        saveCartToDb(updatedCart);

        return updatedCart;
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError(error.message);
    }
  }, [setCart, saveCartToDb, removeFromCart]);

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