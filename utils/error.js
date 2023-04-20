const createError = (statusCode, reason, message) => {
  return { statusCode, reason, message };
};

const missingCredentialsError = createError(101, "Missing credentials", "Please provide a name, email, and password");
const invalidCredentialsError = createError(102, "Invalid credentials", "The email or password you entered is incorrect");
const emailExistsError = createError(103, "Email already exists", "This email address is already in use");
const passwordTooShortError = createError(104, "Password too short", "Password must be at least 8 characters");
const invalidTokenError = createError(201, "Invalid token", "The token you provided is invalid");
const expiredTokenError = createError(202, "Expired token", "The token you provided has expired");
const serverError = createError(500, "Server error", "Something went wrong");

module.exports = {
  missingCredentialsError,
  invalidCredentialsError,
  emailExistsError,
  passwordTooShortError,
  invalidTokenError,
  expiredTokenError,
  serverError,
};
