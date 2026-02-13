import api from "./api";

export const login = async (data: any) => {
  try {
    console.log("Attempting login:", { email: data.email });
    const response = await api.post("/auth/login", data);
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const register = async (data: any) => {
  try {
    console.log("Attempting registration:", {
      email: data.email,
      name: data.name,
    });
    const response = await api.post("/auth/signup", data);
    console.log("Registration successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
