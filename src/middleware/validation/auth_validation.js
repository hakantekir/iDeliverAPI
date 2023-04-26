const joi = require("joi");
const APIError = require("../../utils/errors");

class AuthValidation {
  constructor() {}

  static register = async (req, res, next) => {
    try {
      await joi
        .object({
          name: joi.string().required().trim().min(3).max(30).messages({
            "string.empty": `Name cannot be an empty field`,
            "string.min": `Name should have a minimum length of {#limit}`,
            "string.max": `Name should have a maximum length of {#limit}`,
            "any.required": `Name is a required field`,
          }),
          surname: joi.string().required().trim().min(3).max(30).messages({
            "string.empty": `Surname cannot be an empty field`,
            "string.min": `Surname should have a minimum length of {#limit}`,
            "string.max": `Surname should have a maximum length of {#limit}`,
            "any.required": `Surname is a required field`,
          }),
          email: joi.string().email().trim().required().messages({
            "string.empty": `Email cannot be an empty field`,
            "string.email": `Email should be a valid email`,
            "any.required": `Email is a required field`,
          }),
          phone: joi.string().trim().required().min(11).max(11).messages({
            "string.empty": `Phone cannot be an empty field`,
            "string.min": `Phone should have a minimum length of {#limit}`,
            "string.max": `Phone should have a maximum length of {#limit}`,
            "any.required": `Phone is a required field`,
          }),
          password: joi.string().trim().required().min(6).messages({
            "string.empty": `Password cannot be an empty field`,
            "string.min": `Password should have a minimum length of {#limit}`,
            "any.required": `Password is a required field`,
          }),
        })
        .validateAsync(req.body); // <---
    } catch (error) {
      if (error.details[0].message && error.details) {
        throw new APIError(error.details[0].message, 400 || error.detail);
      }
    }
    next();
  };

  static login = async (req, res, next) => {
    try {
      await joi
        .object({
          email: joi.string().email().trim().required().messages({
            "string.empty": `Email cannot be an empty field`,
            "string.email": `Email should be a valid email`,
            "any.required": `Email is a required field`,
          }),
          password: joi.string().trim().required().min(6).messages({
            "string.empty": `Password cannot be an empty field`,
            "string.min": `Password should have a minimum length of {#limit}`,
            "any.required": `Password is a required field`,
          }),
        })
        .validateAsync(req.body); // <---
    } catch (error) {
      if (error.details[0].message && error.details) {
        throw new APIError(error.details[0].message, 400 || error.detail);
      }
    }
    next();
  };
}

module.exports = AuthValidation;
