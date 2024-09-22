const CartEmpty = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <img
          src="https://i.imgur.com/dCdflKN.png"
          width="130"
          height="130"
          className="mb-4"
          alt="Empty Cart Image"
        />
        <p className="text-gray-400">Your Cart is empty</p>
      </div>
    </>
  );
};

export default CartEmpty;
