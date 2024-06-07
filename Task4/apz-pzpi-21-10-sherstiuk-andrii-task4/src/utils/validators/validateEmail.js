const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !(emailRegex.test(value)) ? "Некорректный email" : undefined;
};

export default validateEmail;
