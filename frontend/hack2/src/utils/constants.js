export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const ORDER_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },
  PRODUCTS: "/products",
  CATEGORIES: "/categories",
  CART: "/cart",
  ORDERS: "/orders",
  ADMIN: {
    ORDERS: "/admin/orders",
  },
};
