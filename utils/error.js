const createError = (statusCode, reason, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.reason = reason;
    return error;
};

const missingCredentialsError = createError(400, "Missing credentials", "Please provide a name, email, and password");
const invalidCredentialsError = createError(401, "Invalid credentials", "The email or password you entered is incorrect");
const emailExistsError = createError(409, "Email already exists", "This email address is already in use");
const passwordTooShortError = createError(422, "Password too short", "Password must be at least 8 characters");
const invalidTokenError = createError(401, "Invalid token", "The token you provided is invalid");
const expiredTokenError = createError(401, "Expired token", "The token you provided has expired");
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
