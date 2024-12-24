const initializePaystackTransaction = async (email, amount) => {
  console.log(email, amount);
  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          amount: amount * 100,
        }),
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error initializing Paystack transaction:", error);
    throw new Error("Failed to initialize Paystack transaction");
  }
};

export default initializePaystackTransaction;
