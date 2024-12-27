"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Camera, Loader, Edit, X, Check, Trash } from "lucide-react";
import ImageUpload from "@/components/Imageupload";
import { useProductDetails } from "./useProductDetails";
// import { useProductDetails } from "./useProductDetails";

const ProductDetails = ({ params }) => {
  const { id } = params || {};
  const { data: session } = useSession();
  const {
    state: {
      loading,
      isEditing,
      productData,
      editedData,
      errors,
      status,
      imageUploading,
    },
    actions: {
      handleInputChange,
      handleEdit,
      handleCancel,
      handleSubmit,
      handleImageUpload,
      handleCategoryChange,
      handleRemoveCategory,
    },
  } = useProductDetails({ id, session });

  if (loading && !productData.name) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-16 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Status Messages */}
        {status.error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {status.error}
          </div>
        )}
        {status.success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            Product successfully updated!
          </div>
        )}

        {/* Header */}
        <ProductHeader
          isEditing={isEditing}
          loading={loading}
          productName={productData.name}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />

        {/* Main Content */}
        <div className="space-y-6">
          <ImageSection
            isEditing={isEditing}
            imageUrl={isEditing ? editedData.image : productData.image}
            productName={productData.name}
            onUpload={handleImageUpload}
            isUploading={imageUploading}
          />

          {isEditing ? (
            <EditForm
              data={editedData}
              errors={errors}
              onChange={handleInputChange}
              onCategoryChange={handleCategoryChange}
              onRemoveCategory={handleRemoveCategory}
            />
          ) : (
            <DisplayInfo data={productData} />
          )}
        </div>
      </div>
    </div>
  );
};

const ProductHeader = ({
  isEditing,
  loading,
  productName,
  onEdit,
  onCancel,
  onSubmit,
}) => (
  <div className="flex justify-between items-center mb-6">
    {isEditing ? (
      <>
        <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? (
              <Loader className="animate-spin w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </>
    ) : (
      <>
        <h1 className="text-2xl font-bold text-gray-800">{productName}</h1>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          <Edit className="w-4 h-4" />
          Edit Product
        </button>
      </>
    )}
  </div>
);

const ImageSection = ({
  isEditing,
  imageUrl,
  productName,
  onUpload,
  isUploading,
}) => (
  <div className="aspect-video relative rounded-lg overflow-hidden">
    {imageUrl ? (
      <div className="relative h-full">
        <img
          src={imageUrl}
          alt={productName || "Product"}
          className="w-full h-full object-cover"
        />
        {isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <ImageUpload onImageUpload={onUpload}>
              <button
                type="button"
                className="bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                Change Image
              </button>
            </ImageUpload>
          </div>
        )}
      </div>
    ) : (
      <div className="h-full flex flex-col items-center justify-center bg-gray-100">
        <Camera className="w-12 h-12 text-gray-400 mb-4" />
        {isEditing && (
          <ImageUpload onImageUpload={onUpload}>
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader className="animate-spin w-4 h-4" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
              Upload Image
            </button>
          </ImageUpload>
        )}
      </div>
    )}
  </div>
);

const FormField = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const EditForm = ({
  data,
  errors,
  onChange,
  onCategoryChange,
  onRemoveCategory,
}) => (
  <form className="space-y-6">
    <FormField label="Product Name" error={errors.name}>
      <input
        type="text"
        value={data.name}
        onChange={(e) => onChange("name", e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg ${
          errors.name ? "border-red-500" : "border-gray-300"
        }`}
      />
    </FormField>

    <FormField label="Description">
      <textarea
        value={data.description}
        onChange={(e) => onChange("description", e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
      />
    </FormField>

    <FormField label="Categories" error={errors.category}>
      <div className="flex flex-wrap gap-2 mb-2">
        {data.category?.map((cat) => (
          <span
            key={cat}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center"
          >
            {cat}
            <button
              type="button"
              onClick={() => onRemoveCategory(cat)}
              className="ml-2 text-gray-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder="Add category and press Enter"
        onKeyPress={onCategoryChange}
        className={`w-full px-3 py-2 border rounded-lg ${
          errors.category ? "border-red-500" : "border-gray-300"
        }`}
      />
    </FormField>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Price ($)" error={errors.price}>
        <input
          type="number"
          value={data.price}
          onChange={(e) => onChange("price", e.target.value)}
          min="0"
          step="0.01"
          className={`w-full px-3 py-2 border rounded-lg ${
            errors.price ? "border-red-500" : "border-gray-300"
          }`}
        />
      </FormField>

      <FormField label="Stock Quantity" error={errors.instock}>
        <input
          type="number"
          value={data.instock}
          onChange={(e) => onChange("instock", e.target.value)}
          min="0"
          step="1"
          className={`w-full px-3 py-2 border rounded-lg ${
            errors.instock ? "border-red-500" : "border-gray-300"
          }`}
        />
      </FormField>
    </div>
  </form>
);

const DisplayInfo = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h2 className="text-lg font-semibold mb-2">Description</h2>
      <p className="text-gray-600">
        {data.description || "No description available"}
      </p>
    </div>

    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Price</h2>
        <p className="text-2xl font-bold text-blue-600">
          ${Number(data.price || 0).toFixed(2)}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">In Stock</h2>
        <p className="text-xl">{data.instock || 0} units</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {data.category?.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetails;
