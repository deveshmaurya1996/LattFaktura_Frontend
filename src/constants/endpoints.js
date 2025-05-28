if (!process.env.REACT_APP_BASE_URL) {
  console.error("API BASE URL is not defined in environment");
}
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const endpoints = {
  login: {
    url: `${BASE_URL}/login`,
    method: "POST",
  },
  register: {
    url: `${BASE_URL}/register`,
    method: "POST",
  },
  profile: {
    url: `${BASE_URL}/profile`,
    method: "GET",
  },
  getProducts: {
    url: `${BASE_URL}/products`,
    method: "GET",
  },
  createProduct: {
    url: `${BASE_URL}/product`,
    method: "POST",
  },
  updateProduct: (id) => ({
    url: `${BASE_URL}/product/${id}`,
    method: "PUT",
  }),
  deleteProduct: (id) => ({
    url: `${BASE_URL}/product/${id}`,
    method: "DELETE",
  }),
};
