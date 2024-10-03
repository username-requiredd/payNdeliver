"use  client"
import React, { useEffect, useState, useRef } from 'react';
import { createQR, encodeURL } from '@solana/pay';
import { PublicKey, Keypair } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { CreditCard, Coins } from 'lucide-react';
import { useCart } from '@/contex/cartcontex';
export default function EnhancedCheckout() {
const {cart} = useCart()
// console.log(cart)
  const [reference, setReference] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const qrRef = useRef(null);

  useEffect(() => {
    const newReference = Keypair.generate().publicKey;
    setReference(newReference);

    const recipient = new PublicKey('a8xbmjRKktM4Np8M2RS6a3nrygQq7aaguNe9n7JFfjE');
    const amount = new BigNumber(0.1);
    const memo = 'Payment for Chicken Sharwarma';

    const url = encodeURL({ recipient, amount, reference: newReference, memo });
    const qr = createQR(url);

    if (qrRef.current && paymentMethod === 'crypto') {
      qrRef.current.innerHTML = '';
      qr.append(qrRef.current);
    }
  }, [paymentMethod]);

  const handleInputChange = (e, setFunction) => {
    const { name, value } = e.target;
    setFunction(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment submitted:', { paymentMethod, cardDetails, shippingDetails });
  };

  const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 px-4 py-2 bg-white";

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 to-teal-100 rounded-2xl shadow-2xl">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-green-800 tracking-tight">Secure Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-700">Shipping Information</h2>
          <form className="space-y-4">
            {Object.entries(shippingDetails).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {key}
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={value}
                  onChange={(e) => handleInputChange(e, setShippingDetails)}
                  className={inputClasses}
                  required
                />
              </div>
            ))}
          </form>
        </div>

        <div className="flex-1 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-700">Payment Method</h2>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
            <button
              onClick={() => setPaymentMethod('crypto')}
              className={`flex items-center justify-center px-4 sm:px-6 py-3 rounded-full transition-all duration-300 ${
                paymentMethod === 'crypto' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
              }`}
            >
              <Coins className="mr-2" size={20} />
              Pay with Crypto
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center justify-center px-4 sm:px-6 py-3 rounded-full transition-all duration-300 ${
                paymentMethod === 'card' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
              }`}
            >
              <CreditCard className="mr-2" size={20} />
              Pay with Card
            </button>
          </div>

          {paymentMethod === 'crypto' ? (
            <div className="text-center bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner">
              <div ref={qrRef} className="inline-block" />
              {reference && (
                <p className="mt-4 text-sm text-gray-600">
                  Reference: {reference.toBase58().substring(0, 8)}...
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.entries(cardDetails).map(([key, value]) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize mb-1">
                    {key === 'number' ? 'Card Number' : key}
                  </label>
                  <input
                    type={key === 'number' ? 'text' : key === 'expiry' ? 'text' : key === 'cvc' ? 'password' : 'text'}
                    id={key}
                    name={key}
                    value={value}
                    onChange={(e) => handleInputChange(e, setCardDetails)}
                    className={inputClasses}
                    required
                    placeholder={key === 'expiry' ? 'MM/YY' : ''}
                  />
                </div>
              ))}
            </form>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-8 w-full py-4 px-6 border border-transparent rounded-full shadow-lg text-lg font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Complete Purchase
      </button>
    </div>
  );
}