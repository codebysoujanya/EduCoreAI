export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  // min 6 chars, 1 number recommended
  return password && password.length >= 6;
};

export const validateRequiredFields = (fields = {}) => {
  const missing = [];

  Object.keys(fields).forEach((key) => {
    if (
      fields[key] === undefined ||
      fields[key] === null ||
      fields[key] === ""
    ) {
      missing.push(key);
    }
  });

  return missing;
};