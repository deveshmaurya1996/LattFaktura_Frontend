import React, { useState, useEffect, useRef, useCallback } from "react";
import "./../styles/PriceList.css";
import { Search } from "lucide-react";
import productService from "../api/productService";
import { debounce } from "lodash";

const PriceList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [freeSearch, setFreeSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    inPrice: "",
    price: "",
    inStock: "",
    description: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    inPrice: "",
    price: "",
    inStock: "",
    description: "",
  });
  const [apiError, setApiError] = useState(null);
  const observer = useRef();

  // Fetch products with infinite scroll
  const fetchProducts = useCallback(
    async (reset = false, searchQuery = productSearch) => {
      if (loading || (!hasMore && !reset)) return;
      setLoading(true);
      setApiError(null);

      try {
        const data = await productService.getProducts({
          page: reset ? 1 : page,
          limit: 10,
          search: searchQuery,
        });

        setProducts((prev) =>
          reset ? data.products : [...prev, ...data.products]
        );
        setHasMore(data.currentPage < data.totalPages);
        setPage((prev) => (reset ? 2 : prev + 1));
      } catch (error) {
        setApiError("Server busy, please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page]
  );

  // Infinite scroll observer
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchProducts]
  );

  // Initial load
  useEffect(() => {
    fetchProducts(true);
  }, [productSearch]);

  const debouncedFetchProducts = useCallback(
    debounce((searchQuery) => {
      fetchProducts(true, searchQuery); // reset and use new search
    }, 500),
    [fetchProducts]
  );

  useEffect(() => {
    debouncedFetchProducts(productSearch);
    // Cancel debounce on unmount
    return () => debouncedFetchProducts.cancel();
  }, [productSearch]);

  // Search functionality
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesFreeSearch =
        freeSearch === "" ||
        Object.entries(product).some(([key, value]) => {
          if (key === "id") return false;
          return String(value).toLowerCase().includes(freeSearch.toLowerCase());
        });
      return matchesFreeSearch;
    });
    setFilteredProducts(filtered);
  }, [products, freeSearch]);

  // Handlers
  const toggleMenu = (productId, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === productId ? null : productId);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.product_name,
      inPrice: product.in_price,
      price: product.price,
      inStock: product.in_stock,
      description: product.description,
    });
    setActiveMenu(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setApiError(null);
    try {
      const updatedProduct = await productService.updateProduct(
        editingProduct.id,
        editFormData
      );
      if (updatedProduct.id) {
        setProducts((prev) =>
          prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        setEditingProduct(null);
      }
    } catch (error) {
      setApiError("Failed to update product. Please try again.");
    }
  };

  const handleCreate = async () => {
    setApiError(null);
    try {
      const createdProduct = await productService.createProduct(newProduct);
      setProducts((prev) => [createdProduct, ...prev]);
      setNewProduct({
        name: "",
        inPrice: "",
        price: "",
        inStock: "",
        description: "",
      });
      setIsCreating(false);
    } catch (error) {
      setApiError("Failed to create product. Please try again.");
    }
  };

  const handleDelete = async (productId) => {
    setApiError(null);
    try {
      await productService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      setApiError("Failed to delete product. Please try again.");
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleClickOutside = () => {
    setActiveMenu(null);
  };

  const handleProductSearchChange = (e) => setProductSearch(e.target.value);
  const handleFreeSearchChange = (e) => setFreeSearch(e.target.value);

  return (
    <div className="price-list-container" onClick={handleClickOutside}>
      <div className="price-list-header">
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Product..."
              className="search-input"
              value={productSearch}
              onChange={handleProductSearchChange}
            />
            <Search className="search-icon" />
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Free Search"
              className="search-input"
              value={freeSearch}
              onChange={handleFreeSearchChange}
            />
            <Search className="search-icon" />
          </div>
          <button className="create-button" onClick={() => setIsCreating(true)}>
            Create Product
          </button>
        </div>
      </div>

      {apiError && <div className="error-message">{apiError}</div>}

      <div className="price-list-table-container">
        <table className="price-list-table">
          <thead>
            <tr>
              <th>Product / Service</th>
              <th>In Price</th>
              <th>Price</th>
              <th>In Stock</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr
                key={product.id}
                ref={
                  index === filteredProducts.length - 1 ? lastProductRef : null
                }
              >
                <td>{product.product_name}</td>
                <td>{product.in_price}</td>
                <td>{product.price}</td>
                <td>{product.in_stock}</td>
                <td>{product.description}</td>
                <td className="actions-cell">
                  <div className="dropdown">
                    <button
                      className="dropdown-toggle"
                      onClick={(e) => toggleMenu(product.id, e)}
                      aria-label="Actions"
                    >
                      <span className="dots">⋯</span>
                    </button>
                    {activeMenu === product.id && (
                      <div className="dropdown-menu">
                        <button
                          className="dropdown-item"
                          onClick={() => handleEditClick(product)}
                        >
                          Edit Product
                        </button>
                        <button
                          className="dropdown-item delete"
                          onClick={() => setShowDeleteConfirm(product.id)}
                        >
                          Delete Product
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="loading">Loading more products...</div>}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Product</h3>
            <div className="price-form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="price-form-group">
              <label>In Price</label>
              <input
                type="number"
                name="inPrice"
                value={editFormData.inPrice}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="price-form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={editFormData.price}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="price-form-group">
              <label>In Stock</label>
              <input
                type="number"
                name="inStock"
                value={editFormData.inStock}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="price-form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={editFormData.description}
                onChange={handleEditFormChange}
              />
            </div>
            <div className="modal-actions">
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
              <button
                className="close-button"
                onClick={() => setEditingProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {isCreating && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Product</h3>
            <div className="price-form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleNewProductChange}
              />
            </div>
            <div className="price-form-group">
              <label>In Price</label>
              <input
                type="number"
                name="inPrice"
                value={newProduct.inPrice}
                onChange={handleNewProductChange}
              />
            </div>
            <div className="price-form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleNewProductChange}
              />
            </div>
            <div className="price-form-group">
              <label>In Stock</label>
              <input
                type="number"
                name="inStock"
                value={newProduct.inStock}
                onChange={handleNewProductChange}
              />
            </div>
            <div className="price-form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={newProduct.description}
                onChange={handleNewProductChange}
              />
            </div>
            <div className="modal-actions">
              <button className="save-button" onClick={handleCreate}>
                Create
              </button>
              <button
                className="close-button"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content confirm-dialog">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this product?</p>
            <p>The product will be permanently deleted if you choose yes.</p>
            <div className="modal-actions">
              <button
                className="delete-button"
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                Yes, Delete
              </button>
              <button
                className="close-button"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceList;
