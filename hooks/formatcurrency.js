  export const formatCurrency = (amount, locale = "en-US", currency = "NGN") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  };
  