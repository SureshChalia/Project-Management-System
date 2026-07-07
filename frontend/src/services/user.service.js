import api from "../api/axios";

const searchUsers = async (q) => {
  const res = await api.get(`/api/v1/users`, { params: { q } });
  return res.data;
};

const listUsers = async () => {
  const res = await api.get(`/api/v1/users/admin`);
  return res.data;
};

const updateUser = async (userId, payload) => {
  const res = await api.put(`/api/v1/users/admin/${userId}`, payload);
  return res.data;
};

const deleteUser = async (userId) => {
  const res = await api.delete(`/api/v1/users/admin/${userId}`);
  return res.data;
};

export default { searchUsers, listUsers, updateUser, deleteUser };
