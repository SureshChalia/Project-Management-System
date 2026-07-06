import api from "../api/axios";

const searchUsers = async (q) => {
  const res = await api.get(`/api/v1/users`, { params: { q } });
  return res.data;
};

export default { searchUsers };
