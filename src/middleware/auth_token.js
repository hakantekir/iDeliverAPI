require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const APIError = require("../utils/errors");
const Response = require("../utils/response");

//!! Düzenleme yapılacak.

const createToken = async (user, res) => {
  console.log(user);

  const payload = {
    sub: user._id, // <--- jwt.io will show this as "sub"
    name: user.name,
  };

  // const token = jwt.sign({username:user.username,
  //role:{name:_role.name, sections:sections_fetched}},
  // 'secret', {expiresIn : '24h'}, process.env.JWT_TOKEN_SECRET);

  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    algorithm: "HS512",
    expiresIn: "2h", // or process.env.JWT_EXPIRES_IN
  });

  return Response.success(res, {
    status: "success",
    token: token,
    message: "Login successfully",
  });
};

//token control middleware function for protected routes
const tokenCheck = async (req, res, next) => {
  // const headerToken =
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer ");

  // if (!headerToken) {
  //   throw new APIError("Token not found", 401);
  // }

  // const token = req.headers.authorization.split(" ")[1]; //boşluklara ayır ve 1. elemanı al

  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  console.log("token :", token);

  await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    console.log("decoded :", decoded);
    console.log("err :", err);
    if (err) {
      throw new APIError("Token is not valid", 401); //401 unauthorized
    }

    //Eğer çözümlenmiş token içindeki sub değeri ile veritabanında bulunan user._id değeri eşleşmiyorsa
    //hata fırlat
    const userInfo = await User.findById(decoded.sub).select("_id name email phone"); //decoded.sub = user._id

    if (!userInfo) {
      throw new APIError("User not found and Invalid Token.", 404);
    }

    req.user = userInfo;
  });

  next(); //next middleware
};

//authcontrollerdan yani dönen user bilgilerinden token oluştur.
const createTemporaryToken = async (userId, email) => {
  //payload tokenin içerisine gizlenecek değerler.
  const payload = {
    sub: userId, // <--- jwt.io will show this as "sub"
    email: email,
  };

  const token = await jwt.sign(payload, process.env.JWT_TEMPORARY_KEY, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_EXPIRES_IN_TEMPORARY, // or process.env.JWT_EXPIRES_IN
  });

  return token;
};

const decodedTemporaryToken = (tempToken) => {
  //  console.log("tempToken :", tempToken);
  //  const token = tempToken.split(" ")[1]; //boşluklara ayır ve 1. elemanı al

  return new Promise((resolve, reject) => {
    jwt.verify(tempToken, process.env.JWT_TEMPORARY_KEY, async (err, decoded) => {
      if (err) {
        console.log("err :", err.message);
        // throw new APIError("Token is not valid", 401); //401 unauthorized
        reject(new APIError("Token is not valid", 401));
      }
      const userInfo = User.findById(decoded.sub).select("_id name surname email phone");

      if (!userInfo) {
        reject(new APIError("User not found and Invalid Token.", 404));
        // throw new APIError("User not found and Invalid Token.", 404);
      }

      resolve(userInfo);
    });
  });
};

module.exports = {
  createToken,
  tokenCheck,
  createTemporaryToken,
  decodedTemporaryToken,
};
