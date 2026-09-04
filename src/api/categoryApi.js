import api from "./api";

export const getCategories = () => api.get("/categories/get-all-categories");
export const createCategory = (data) => api.post("/categories/create-category", data);
export const updateCategory = (id, data) => api.patch(`/categories/update-category/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/delete-category/${id}`);