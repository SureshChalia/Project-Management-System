import api from "../api/axios";

const register = async (payload) => {
  const res = await api.post("/api/v1/auth/register", payload);
  return res.data;
};

const login = async (payload) => {
  const res = await api.post("/api/v1/auth/login", payload);
  return res.data;
};

const me = async () => {
  const res = await api.get("/api/v1/auth/me");
  return res.data;
};

export default { register, login, me };
