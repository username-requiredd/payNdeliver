"use client";

import { useSession } from "next-auth/react";
import { 
  useState, 
  useContext, 
  createContext, 
  useEffect, 
  useMemo, 
  useCallback 
} from "react";
import useLocalStorage from "./uselocalstorage";

// Constants
const CART_VERSION = '1.0.0';
const MAX_QUANTITY = 99;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const CART_EXPIRY_DAYS = 7;

const CartContext = createContext();

// Initial cart state
const initialCartState = {
  version: CART_VERSION,
  items: []
};

// Utility Functions
const isExpired = (timestamp) => {
  const expiryTime = CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - timestamp > expiryTime;
};

const validateProduct = (product) => {
  if (!product) {
    throw new Error('Product is undefined or null');
  }

  const required = ['id', 'name', 'price', 'quantity', 'image', 'storeId', 'storeName'];
  
  for (const field of required) {
    if (!product[field] && product[field] !== 0) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return {
    id: String(product.id || product._id),
    storeId: String(product.storeId),
    storeName: String(product.storeName),
    name: String(product.name),
    price: Math.round(Number(product.price) * 100) / 100,
    quantity: Math.min(Math.max(1, Number(product.quantity)), MAX_QUANTITY),
    image: String(product.image),
    timestamp: Date.now()
  };
};

const calculateTotal = (products = []) => {
  if (!Array.isArray(products)) return 0;
  return Number(products.reduce((acc, product) => 
    acc + (product.price * product.quantity), 0
  ).toFixed(2));
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useLocalStorage("cart", initialCartState);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState(null);

  // Validate cart consistency
  const validateCartConsistency = useCallback((cartItems = []) => {
    if (!Array.isArray(cartItems)) return [];
    
    const seenStoreIds = new Set();
    const validItems = cartItems.filter(item => {
      if (!item || !item.storeId || !item.storeName) return false;
      seenStoreIds.add(item.storeId);
      return !isExpired(item.timestamp);
    });
    
    if (seenStoreIds.size > 1) {
      throw new Error('Items from multiple stores not allowed in same cart');
    }

    return validItems;
  }, []);

  // Save cart to database with retry logic
  const saveCartToDb = useCallback(async (products, retryCount = MAX_RETRIES) => {
    const userId = session?.user?.id;
    if (!userId || !Array.isArray(products)) return;

    try {
      setLoading(true);
      const validatedProducts = products
        .filter(Boolean)
        .map(product => validateProduct(product));
        
      if (validatedProducts.length === 0) return;

      const consistentProducts = validateCartConsistency(validatedProducts);
      const total = calculateTotal(consistentProducts);

      const response = await fetch(`/api/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          products: consistentProducts,
          total
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update cart");
      }

      setLastSyncTimestamp(Date.now());
    } catch (error) {
      console.error("Error updating cart in the database:", error);
      if (retryCount > 0) {
        setTimeout(() => saveCartToDb(products, retryCount - 1), RETRY_DELAY);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, validateCartConsistency]);

  // Fetch cart from database
  const fetchCart = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId || isFetching) return;

    setIsFetching(true);
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/cart/${userId}`);
      if (!response.ok) {
        throw new Error("Error fetching cart data try checking your connection or try again later!");
      }

      const { products } = await response.json();
      
      if (Array.isArray(products) && products.length > 0) {
        const validatedProducts = products
          .filter(Boolean)
          .map(product => validateProduct({
            id: product._id || product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            image: product.image,
            storeId: product.storeId,
            storeName: product.storeName
          }));


          console.log("validated products:",validatedProducts)

        const consistentProducts = validateCartConsistency(validatedProducts);
        
        setCart({
          version: CART_VERSION,
          items: consistentProducts
        });
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsFetching(false);
      setIsInitialized(true);
      setLastSyncTimestamp(Date.now());
    }
  }, [session?.user?.id, setCart, isFetching, validateCartConsistency]);

  // Initialize cart
  useEffect(() => {
    if (status === "authenticated" && !isInitialized && !isFetching) {
      fetchCart();
    }
  }, [status, fetchCart, isInitialized, isFetching]);

  // Cart operations
  const addToCart = useCallback((product) => {
    if (!product) return;

    try {
      const validatedProduct = validateProduct(product);
      
      setCart((prevCart) => {
        const existingItems = Array.isArray(prevCart.items) ? prevCart.items : [];
        const productExist = existingItems.find((item) => item.id === validatedProduct.id);
        let updatedItems;

        if (productExist) {
          const newQuantity = Math.min(productExist.quantity + 1, MAX_QUANTITY);
          updatedItems = existingItems.map((item) =>
            item.id === validatedProduct.id
              ? { ...item, quantity: newQuantity, timestamp: Date.now() }
              : item
          );
        } else {
          if (existingItems.length > 0 && 
              existingItems[0].storeId !== validatedProduct.storeId) {
            throw new Error("Cannot add items from different stores");
          }
          updatedItems = [...existingItems, { ...validatedProduct, quantity: 1 }];
        }

        // Save to DB if authenticated
        if (session?.user?.id && Array.isArray(updatedItems)) {
          saveCartToDb(updatedItems);
        }

        return {
          version: CART_VERSION,
          items: updatedItems
        };
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setError(error.message);
    }
  }, [setCart, saveCartToDb, session?.user?.id]);

  const removeFromCart = useCallback((productId) => {
    if (!productId) return;

    try {
      setCart((prevCart) => {
        const existingItems = Array.isArray(prevCart.items) ? prevCart.items : [];
        const updatedItems = existingItems.filter((item) => item.id !== productId);
        
        if (session?.user?.id) {
          saveCartToDb(updatedItems);
        }

        return {
          version: CART_VERSION,
          items: updatedItems
        };
      });
    } catch (error) {
      console.error("Error removing product from cart:", error);
      setError(error.message);
    }
  }, [setCart, saveCartToDb, session?.user?.id]);

  const clearCart = useCallback(() => {
    try {
      setCart(initialCartState);
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
      cart: Array.isArray(cart?.items) ? cart.items : [],
      addToCart,
      removeFromCart,
      clearCart,
      loading,
      error,
      total: calculateTotal(cart?.items)
    }),
    [cart, addToCart, removeFromCart, clearCart, loading, error]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};