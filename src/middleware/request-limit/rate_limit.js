const rateLimit = require("express-rate-limit");
// Login endpoint'i için rate limit

const allowList = ["::1"];

const RateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req, res) => {
    console.log("req.url : ", req.url);
    console.log("req.ip : ", req.ip);

    if (req.url === "/v1/auth/login" || req.url === "v1/auth/register") {
      return 5;
    }
    return 100;
  },

  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after an hour",
  },

  skip: (req, res) => allowList.includes(req.ip), //HATA olabilir. Düzeltilecek.

  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = RateLimit;
