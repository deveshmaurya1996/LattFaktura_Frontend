import React, { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  return (
    <ProductContext.Provider
      value={{
        editingProduct,
        setEditingProduct,
        isCreating,
        setIsCreating,
        showDeleteConfirm,
        setShowDeleteConfirm,
        isDeleteLoading,
        setIsDeleteLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

export default ProductContext;
