import React, { useEffect, useMemo, useState } from "react";
import userService from "../../services/user.service";
import DeleteModal from "../../components/common/DeleteModal";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const pageSize = 10;

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.listUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => {
      return [
        user.firstName,
        user.lastName,
        user.email,
        user.role,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [search, users]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const pagedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = async (userId, newRole) => {
    setSavingUserId(userId);
    try {
      const res = await userService.updateUser(userId, { role: newRole });
      setUsers((prev) => prev.map((user) => (user._id === userId ? res.data.user : user)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update user role.");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleActiveToggle = async (userId, isActive) => {
    setSavingUserId(userId);
    try {
      const res = await userService.updateUser(userId, { isActive });
      setUsers((prev) => prev.map((user) => (user._id === userId ? res.data.user : user)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update user status.");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDelete = async (userId) => {
    setDeletingUserId(userId);
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      setSelectedUser(null);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete user.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
  };

  const closeDeleteModal = () => {
    if (deletingUserId) return;
    setSelectedUser(null);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-gray-600">Admin-only access to list, update, and delete users.</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            type="search"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search users by name, email, or role"
            className="w-full md:w-80 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="text-sm text-gray-500 md:ml-4">
            Showing {filteredUsers.length} of {users.length}
          </div>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <div className="text-gray-600">Loading users...</div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-300 rounded shadow-sm">
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Role</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pagedUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-sm text-gray-500">
                    No users match your search.
                  </td>
                </tr>
              ) : (
                pagedUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        value={user.role}
                        disabled={savingUserId === user._id}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Member">Member</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className={`rounded-full px-3 py-1 text-sm ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        disabled={savingUserId === user._id}
                        onClick={() => handleActiveToggle(user._id, !user.isActive)}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 space-x-2">
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        disabled={deletingUserId === user._id}
                        onClick={() => openDeleteModal(user)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredUsers.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            Page {page} of {pageCount}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 bg-gray-100 rounded text-sm disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <button
              className="px-3 py-2 bg-gray-100 rounded text-sm disabled:opacity-50"
              disabled={page === pageCount}
              onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedUser && (
        <DeleteModal
          title="Delete user"
          message={`Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}? This action cannot be undone.`}
          onConfirm={() => handleDelete(selectedUser._id)}
          onCancel={closeDeleteModal}
          loading={deletingUserId === selectedUser._id}
        />
      )}
    </div>
  );
}
