import api from "./api";

export const adminService = {
  getAllOrders: () => api.get("/admin/orders"),
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
};
