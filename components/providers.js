"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/contex/cartcontex";
import { SessionProvider } from "next-auth/react";
const queryClient = new QueryClient();
export function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </CartProvider>
    </SessionProvider>
  );
}
