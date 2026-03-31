import api from "./api";

export const orderService = {
  checkout: (orderData) => api.post("/orders/checkout", orderData),
  getUserOrders: () => api.get("/orders"),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  cancel: (orderId) => api.put(`/orders/${orderId}/cancel`),
};
