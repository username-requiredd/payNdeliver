"use client";
import { useState } from "react";
import { foodCategories } from "./page";
const AddCategory = ({ onClose }) => {
  // console.log(foodCategories)
  const [newCategory, setNewCategory] = useState({
    name: "",
    amount: "",
  });

  const handleCategory = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Category Added:", newCategory);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
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
          <h2 className="text-xl font-semibold">Add a Category</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                onChange={handleCategory}
                type="text"
                name="name"
                value={newCategory.name}
                placeholder="Enter category name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Items
              </label>
              <input
                onChange={handleCategory}
                name="amount"
                value={newCategory.amount}
                type="number"
                placeholder="Enter amount"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="px-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Add Category
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
