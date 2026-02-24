export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password, minLength = 6) => {
  return password && password.length >= minLength;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone);
};

export const validateNumber = (value) => {
  return !isNaN(value) && isFinite(value);
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) > 0;
};

export const validateDate = (date) => {
  return date instanceof Date && !isNaN(date);
};
