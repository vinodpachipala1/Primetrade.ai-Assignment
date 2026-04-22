export const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!regex.test(password)) {
    throw new Error(
      'Password must be 8+ chars with uppercase, lowercase, number, special char'
    );
  }
};