"use client"
const CartItem = ({ item, removeFromCart, updateQuantity }) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded mr-4" />
          <div>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-gray-600">${item.price.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="text-gray-500 hover:text-gray-700"
          >
            -
          </button>
          <span className="mx-2">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="text-gray-500 hover:text-gray-700"
          >
            +
          </button>
          <button
            onClick={() => removeFromCart(item.id)}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    );
  };

  export default CartItem