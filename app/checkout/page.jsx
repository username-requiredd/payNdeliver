// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/router";
// import { useWallet } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { createQR, encodeURL, findReference, validateTransfer } from '@solana/pay';
// import { Connection, clusterApiUrl, PublicKey, Keypair } from '@solana/web3.js';

// // Solana connection
// const connection = new Connection(clusterApiUrl('mainnet-beta'));

// const CheckoutPage = () => {
//   const router = useRouter();
//   const { publicKey } = useWallet();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     amount: 0,
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [qr, setQr] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validateForm = () => {
//     let tempErrors = {};
//     if (!formData.name.trim()) tempErrors.name = "Name is required";
//     if (!formData.email.trim()) tempErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email))
//       tempErrors.email = "Email is invalid";
//     if (!formData.amount || formData.amount <= 0)
//       tempErrors.amount = "Valid amount is required";
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const createOrder = async (paymentId) => {
//     try {
//       const response = await fetch("/api/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           paymentId,
//           paymentMethod: "solana",
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create order");
//       }

//       const orderResult = await response.json();
//       router.push(`/order-confirmation/${orderResult.orderId}`);
//     } catch (error) {
//       console.error("Error creating order:", error);
//       alert(
//         "An error occurred while creating your order. Please contact support."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePaymentError = (error) => {
//     console.error("Payment error:", error);
//     alert("Payment failed. Please try again.");
//     setIsLoading(false);
//   };

//   const handleSolanaPayment = useCallback(async () => {
//     if (!publicKey) {
//       alert("Please connect your Solana wallet first.");
//       return;
//     }

//     setIsLoading(true);

//     const recipient = new PublicKey(process.env.NEXT_PUBLIC_MERCHANT_WALLET_ADDRESS);
//     const amount = formData.amount;
//     const reference = new Keypair().publicKey;
//     const label = 'Your Store Name';
//     const message = 'Thanks for your purchase!';

//     const urlParams = {
//       recipient,
//       amount,
//       reference,
//       label,
//       message,
//     };

//     const url = encodeURL(urlParams);
//     const qrCode = createQR(url);
//     setQr(qrCode);

//     try {
//       const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });

//       await validateTransfer(connection, signatureInfo.signature, {
//         recipient,
//         amount,
//         reference,
//       });

//       await createOrder(signatureInfo.signature);
//     } catch (error) {
//       console.error('Error processing Solana payment:', error);
//       handlePaymentError(error);
//     }
//   }, [publicKey, formData.amount, createOrder]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       await handleSolanaPayment();
//     }
//   };

//   useEffect(() => {
//     if (qr) {
//       const element = document.getElementById('qr-code');
//       if (element) {
//         element.innerHTML = '';
//         qr.append(element);
//       }
//     }
//   }, [qr]);

//   return (
//     <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
//       <div className="relative py-3 sm:max-w-xl sm:mx-auto">
//         <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
//           <div className="max-w-md mx-auto">
//             <h1 className="text-2xl font-semibold text-center mb-6">
//               Checkout with Solana Pay
//             </h1>
//             <form onSubmit={handleSubmit}>
//               {['name', 'email', 'amount'].map((field) => (
//                 <div key={field} className="mb-4">
//                   <label
//                     className="block text-gray-700 text-sm font-bold mb-2"
//                     htmlFor={field}
//                   >
//                     {field.charAt(0).toUpperCase() + field.slice(1)}
//                   </label>
//                   <input
//                     type={field === 'email' ? 'email' : field === 'amount' ? 'number' : 'text'}
//                     id={field}
//                     name={field}
//                     value={formData[field]}
//                     onChange={handleChange}
//                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   />
//                   {errors[field] && (
//                     <p className="text-red-500 text-xs italic">{errors[field]}</p>
//                   )}
//                 </div>
//               ))}

//               <div className="mb-4">
//                 <WalletMultiButton className="w-full" />
//               </div>

//               {publicKey && (
//                 <button
//                   type="submit"
//                   className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Processing..." : "Pay with Solana"}
//                 </button>
//               )}

//               {qr && <div id="qr-code" className="mt-4 flex justify-center" />}
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
