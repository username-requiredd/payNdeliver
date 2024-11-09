import { Keypair } from '@solana/web3.js';

function generateReference() {
  const reference = Keypair.generate().publicKey.toBytes();
  return reference;
}

// Usage
const reference = generateReference();
// console.log("Reference:", reference);

// If you need it as a base58 encoded string (often used in URLs):
const referenceStr = Keypair.generate().publicKey.toBase58();
// console.log("Reference as string:", referenceStr);