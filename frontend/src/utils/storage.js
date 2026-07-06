const TOKEN_KEY = "token";

const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (err) {
    return null;
  }
};

const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {}
};

const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {}
};

export default { getToken, setToken, removeToken };
export const storage = {
  getToken: () => localStorage.getItem("token"),

  setToken: (token) => localStorage.setItem("token", token),

  removeToken: () => localStorage.removeItem("token"),
};