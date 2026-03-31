import api from "./api";

export const cartService = {
  get: () => api.get("/cart"),
  add: (productId, quantity) => api.post("/cart/add", { productId, quantity }),
  update: (itemId, quantity) => api.put(`/cart/update/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clear: () => api.delete("/cart/clear"),
};
