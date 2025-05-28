import { endpoints } from "../constants/endpoints";
import axiosInstance from "../lib/axiosInstance";

const productService = {
  // Get all products
  getProducts: async ({ page = 1, limit = 10, search = "" } = {}) => {
    try {
      const response = await axiosInstance.get(endpoints.getProducts.url, {
        params: {
          page,
          limit,
          search,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  // Create a new product
  createProduct: async (productData) => {
    try {
      const response = await axiosInstance.post(endpoints.createProduct.url, {
        product_name: productData.name,
        in_price: productData.inPrice,
        price: productData.price,
        in_stock: productData.inStock,
        description: productData.description,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update a product
  updateProduct: async (id, productData) => {
    try {
      const response = await axiosInstance.put(
        endpoints.updateProduct(id).url,
        {
          product_name: productData.name,
          in_price: productData.inPrice,
          price: productData.price,
          in_stock: productData.inStock,
          description: productData.description,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete a product
  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(
        endpoints.deleteProduct(id).url
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
};

export default productService;
