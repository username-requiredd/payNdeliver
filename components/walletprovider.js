"use client";

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CoinbaseWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

// Import default styles for the wallet modal
require('@solana/wallet-adapter-react-ui/styles.css');

export function WalletContextProvider({ children }) {
  // Configure the network - can be 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can customize the RPC endpoint
  const endpoint = useMemo(() => {
    // Use custom RPC URL if provided in environment variables
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    }
    return clusterApiUrl(network);
  }, [network]);

  // Configure supported wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new CoinbaseWalletAdapter()
    ],
    // Only re-initialize wallets if network changes
    [network]
  );

  // Wallet connection configuration
  const walletConfigs = {
    wallets,
    autoConnect: true,
    onError: (error) => {
      console.error('Wallet Error:', error);
      // You can add custom error handling here
    },
  };

  return (
    <ConnectionProvider 
      endpoint={endpoint}
      config={{
        commitment: 'confirmed',
        wsEndpoint: endpoint.replace('https', 'wss'),
      }}
    >
      <WalletProvider {...walletConfigs}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Export a wrapper component for handling hydration issues
export default function ClientWalletProvider({ children }) {
  return (
    <WalletContextProvider>
      {children}
    </WalletContextProvider>
  );
}