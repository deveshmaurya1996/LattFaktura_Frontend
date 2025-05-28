import React, { useState, useEffect, useCallback } from "react";
import "./../styles/PriceList.css";
import { Search } from "lucide-react";
import { useInView } from "react-intersection-observer";
import productService from "../api/productService";
import { debounce } from "lodash";
import CreateProductModal from "../components/ui/CreateProductModal";
import EditProductModal from "../components/ui/EditProductModal";
import DeleteConfirmationModal from "../components/ui/DeleteProductDialogue";
import { useProductContext } from "../contexts/ProductContext";

const PriceList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [freeSearch, setFreeSearch] = useState("");
  const {
    editingProduct,
    setEditingProduct,
    isCreating,
    setIsCreating,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isDeleteLoading,
    setIsDeleteLoading,
  } = useProductContext();

  // Intersection Observer hook
  const { ref: lastProductRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const [apiError, setApiError] = useState(null);

  // Fetch products with infinite scroll
  const fetchProducts = useCallback(
    async (reset = false) => {
      if (loading || (!hasMore && !reset)) return;
      setLoading(true);
      setApiError(null);

      try {
        const data = await productService.getProducts({
          page: reset ? 1 : page,
          limit: 10,
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

  // Trigger fetch when last element is in view
  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchProducts();
    }
  }, [inView, hasMore, loading, fetchProducts]);

  // Initial load
  useEffect(() => {
    fetchProducts(true);
  }, []);

  // Debounced search function
  const performSearch = useCallback(
    debounce((productSearchValue, freeSearchValue) => {
      const filtered = products.filter((product) => {
        // Product name search (productSearch)
        const matchesProductSearch =
          productSearchValue === "" ||
          product.product_name
            .toLowerCase()
            .includes(productSearchValue.toLowerCase());

        // Free search across all fields (freeSearch)
        const matchesFreeSearch =
          freeSearchValue === "" ||
          Object.entries(product).some(([key, value]) => {
            if (key === "id") return false;
            return String(value)
              .toLowerCase()
              .includes(freeSearchValue.toLowerCase());
          });

        return matchesProductSearch && matchesFreeSearch;
      });
      setFilteredProducts(filtered);
    }, 500),
    [products]
  );

  // Trigger search when either search term changes
  useEffect(() => {
    performSearch(productSearch, freeSearch);
    return () => performSearch.cancel();
  }, [productSearch, freeSearch, performSearch]);

  // Handlers
  const toggleMenu = (productId, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === productId ? null : productId);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setActiveMenu(null);
  };

  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDelete = async () => {
    setApiError(null);
    setIsDeleteLoading(true);

    try {
      await productService.deleteProduct(showDeleteConfirm);
      setProducts((prev) => prev.filter((p) => p.id !== showDeleteConfirm));
      setShowDeleteConfirm(null);
    } catch (error) {
      setApiError("Failed to delete product. Please try again.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleClickOutside = () => {
    setActiveMenu(null);
  };

  const handleProductSearchChange = (e) => setProductSearch(e.target.value);
  const handleFreeSearchChange = (e) => setFreeSearch(e.target.value);

  // Close modal handlers
  const handleCloseEditModal = () => {
    setEditingProduct(null);
  };

  const handleCloseCreateModal = () => {
    setIsCreating(false);
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleteLoading) {
      setShowDeleteConfirm(null);
    }
  };

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

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={isCreating}
        onClose={handleCloseCreateModal}
        onProductCreated={handleProductCreated}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={!!editingProduct}
        onClose={handleCloseEditModal}
        product={editingProduct}
        onProductUpdated={handleProductUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!showDeleteConfirm}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this product?"
        subMessage="The product will be permanently deleted if you choose yes."
        isLoading={isDeleteLoading}
        confirmButtonText="Yes, Delete"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default PriceList;
