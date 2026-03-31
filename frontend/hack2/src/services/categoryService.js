import api from "./api";

export const categoryService = {
  getAll: () => api.get("/categories"),
  create: (categoryData) => api.post("/categories", categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};
