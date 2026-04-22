const API_BASE_URL = "http://127.0.0.1:8001/api/v1";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }

  return response;
};

export const authService = {
  login: async (formData: FormData) => {
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: formData, // OAuth2PasswordRequestForm expects form-data
    });
  },
  register: async (data: any) => {
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export const taskService = {
  getTasks: async () => {
    return apiFetch("/tasks/");
  },
  createTask: async (data: any) => {
    return apiFetch("/tasks/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateTask: async (id: number, data: any) => {
    return apiFetch(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteTask: async (id: number) => {
    return apiFetch(`/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
