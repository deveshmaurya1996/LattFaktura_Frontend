import React, { useState, useEffect } from "react";
import productService from "../../api/productService";

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: "",
    inPrice: "",
    price: "",
    inStock: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  // Populate form when product changes or modal opens
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.product_name || "",
        inPrice: product.in_price || "",
        price: product.price || "",
        inStock: product.in_stock || "",
        description: product.description || "",
      });
      setErrors({});
      setApiError(null);
    }
  }, [isOpen, product]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.inPrice || parseFloat(formData.inPrice) < 0) {
      newErrors.inPrice = "Valid in price is required";
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.inStock || parseInt(formData.inStock) < 0) {
      newErrors.inStock = "Valid stock quantity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !product) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const updatedProduct = await productService.updateProduct(
        product.id,
        formData
      );

      // Notify parent component about the updated product
      if (onProductUpdated) {
        onProductUpdated(updatedProduct);
      }

      // Close modal on success
      onClose();
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "Failed to update product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Product</h3>

        {apiError && (
          <div className="error-message" style={{ marginBottom: "15px" }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="price-form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className={errors.name ? "error" : ""}
              disabled={isLoading}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="price-form-group">
            <label>In Price *</label>
            <input
              type="number"
              name="inPrice"
              value={formData.inPrice}
              onChange={handleFormChange}
              step="0.01"
              min="0"
              className={errors.inPrice ? "error" : ""}
              disabled={isLoading}
            />
            {errors.inPrice && (
              <span className="field-error">{errors.inPrice}</span>
            )}
          </div>

          <div className="price-form-group">
            <label>Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              step="0.01"
              min="0"
              className={errors.price ? "error" : ""}
              disabled={isLoading}
            />
            {errors.price && (
              <span className="field-error">{errors.price}</span>
            )}
          </div>

          <div className="price-form-group">
            <label>In Stock *</label>
            <input
              type="number"
              name="inStock"
              value={formData.inStock}
              onChange={handleFormChange}
              min="0"
              className={errors.inStock ? "error" : ""}
              disabled={isLoading}
            />
            {errors.inStock && (
              <span className="field-error">{errors.inStock}</span>
            )}
          </div>

          <div className="price-form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              disabled={isLoading}
              placeholder="Enter product description (optional)"
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Product"}
            </button>
            <button
              type="button"
              className="close-button"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
