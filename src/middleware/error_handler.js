const APIError = require("../utils/errors");

//istanceOf is a method that checks if the object is an instance of the class

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode || 400).json({
      succes: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    succes: false,
    message: "Something went wrong !! Internal Server Error",
  });
};

module.exports = errorHandlerMiddleware;
