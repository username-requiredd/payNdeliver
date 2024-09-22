"use client";

import { useSession } from "next-auth/react";
import { useState, useContext, createContext } from "react";
import useLocalStorage from "./uselocalstorage";

// Create CartContext
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useLocalStorage("cart", []);
  const { data: session } = useSession();

  // Utility function to send PUT request to update cart
  const updateCartInDatabase = async (updatedCart) => {
    if (!session?.user?.id) {
      console.log("User not authenticated");
      return;
    }

    try {
      const response = await fetch(`/api/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          products: updatedCart,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      const data = await response.json();
      console.log('Cart updated successfully:', data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const addToCart = (product) => {
    const productExist = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (productExist) {
      // Update the quantity of the existing product
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: product.quantity }
          : item
      );
    } else {
      updatedCart = [...cart, product]; // Add new product to cart
    }

    setCart(updatedCart);

    // Make PUT request to update cart in the database
    const transformedCart = updatedCart.map((item) => ({
      productId: item.id,
      name: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    updateCartInDatabase(transformedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);

    // Make PUT request to update cart in the database
    const transformedCart = updatedCart.map((item) => ({
      productId: item.id,
      name: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    updateCartInDatabase(transformedCart);
  };

  const clearCart = () => {
    setCart([]);
    updateCartInDatabase([]); // Empty cart in the database
  };

  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);

    // Make PUT request to update cart in the database
    const transformedCart = updatedCart.map((item) => ({
      productId: item.id,
      name: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    updateCartInDatabase(transformedCart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
