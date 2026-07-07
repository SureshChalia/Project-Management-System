import api from "../api/axios";

const getStats = async () => {
  const res = await api.get(`/api/v1/dashboard/stats`);
  return res.data;
};

export default { getStats };