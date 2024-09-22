import React from 'react';

const ProductDetailModal = ({ open, onClose, product }) => {
  if (!open) return null;

  const { product: title, image, category, quantity, price } = product || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="relative h-64">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{category}</p>
          <p className="text-xl text-green-600 font-semibold mb-6">${price}</p>
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-medium">Quantity:</span>
            <div className="flex items-center">
              <span className="mx-4 text-xl font-semibold">{quantity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
