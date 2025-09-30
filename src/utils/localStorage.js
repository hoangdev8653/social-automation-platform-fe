export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = (key) => {
  const value = JSON.parse(localStorage.getItem(key));
  return value;
};

export const clearLocalStorage = () => {
  return localStorage.clear();
};
