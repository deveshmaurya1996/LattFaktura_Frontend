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
import { useLanguage } from "../contexts/LanguageContext";

const PriceList = () => {
  const { t } = useLanguage();
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
        setApiError(t("priceList.server_error"));
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page, t]
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
        const matchesProductSearch =
          productSearchValue === "" ||
          product.product_name
            .toLowerCase()
            .includes(productSearchValue.toLowerCase());

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
      setApiError(t("priceList.delete_error"));
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleClickOutside = () => {
    setActiveMenu(null);
  };

  const handleProductSearchChange = (e) => setProductSearch(e.target.value);
  const handleFreeSearchChange = (e) => setFreeSearch(e.target.value);

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
              placeholder={t("priceList.search_product")}
              className="search-input"
              value={productSearch}
              onChange={handleProductSearchChange}
            />
            <Search className="search-icon" />
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder={t("priceList.free_search")}
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
              <th>{t("priceList.product_service")}</th>
              <th>{t("priceList.in_price")}</th>
              <th>{t("priceList.price")}</th>
              <th>{t("priceList.in_stock")}</th>
              <th>{t("priceList.description")}</th>
              <th>{t("priceList.actions")}</th>
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
                          {t("priceList.edit_product")}
                        </button>
                        <button
                          className="dropdown-item delete"
                          onClick={() => setShowDeleteConfirm(product.id)}
                        >
                          {t("priceList.delete_product")}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="loading">{t("priceList.loading_more")}</div>
        )}
      </div>

      <CreateProductModal
        isOpen={isCreating}
        onClose={handleCloseCreateModal}
        onProductCreated={handleProductCreated}
      />

      <EditProductModal
        isOpen={!!editingProduct}
        onClose={handleCloseEditModal}
        product={editingProduct}
        onProductUpdated={handleProductUpdated}
      />

      <DeleteConfirmationModal
        isOpen={!!showDeleteConfirm}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title={t("priceList.confirm_delete_title")}
        message={t("priceList.confirm_delete_message")}
        subMessage={t("priceList.confirm_delete_submessage")}
        isLoading={isDeleteLoading}
        confirmButtonText={t("priceList.yes_delete")}
        cancelButtonText={t("priceList.cancel")}
      />
    </div>
  );
};

export default PriceList;
