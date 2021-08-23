const ID_TOKEN_KEY = "token";
const ID_REFRESH_TOKEN_KEY = "refreshToken";

export const getToken = (type) => {
  const tokenType = type ? type : "token";
  return window.localStorage.getItem(tokenType);
};

export const saveToken = (token, type) => {
  const tokenType = type ? type : "token";
  window.localStorage.setItem(tokenType, token);
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
  window.localStorage.removeItem(ID_REFRESH_TOKEN_KEY);
};

export default { getToken, saveToken, destroyToken };
