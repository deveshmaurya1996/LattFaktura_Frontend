if (!process.env.REACT_APP_BASE_URL) {
  console.error("API BASE URL is not defined in environment");
}

export const endpoints = {
  login: {
    url: `/login`,
    method: "POST",
  },
  register: {
    url: `/register`,
    method: "POST",
  },
  profile: {
    url: `/profile`,
    method: "GET",
  },
  getProducts: {
    url: `/products`,
    method: "GET",
  },
  createProduct: {
    url: `/product`,
    method: "POST",
  },
  updateProduct: (id) => ({
    url: `/product/${id}`,
    method: "PUT",
  }),
  deleteProduct: (id) => ({
    url: `/product/${id}`,
    method: "DELETE",
  }),
  languageChange: {
    url: `/language`,
    method: "PATCH",
  },
};
