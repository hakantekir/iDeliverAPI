require("dotenv");
const crypto = require("crypto"); //Node.js'ın kendi kütüphanesi. Şifreleme için kullanılıyor.
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("../utils/jwt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const send_mail = require("../utils/mail/send_mail");
const { createTemporaryToken, decodedTemporaryToken } = require("../middleware/auth_token");
const moment = require("moment");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new APIError("Invalid password", 401);
    }

    const token = jwt.generateToken({ id: user._id, email: user.email }); //payload.

    return new Response({ token: token }, "Login succesfully.").success(res);
  } else {
    throw new APIError("User not found", 404);
  }
};

const register = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  const checkUser = await User.findOne({ email: email });
  if (checkUser) {
    throw new APIError("User already exists", 401);
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt); //hash the password
  req.body.password = hashPassword;

  console.log(req.body.password);
  const userSave = new User(req.body);

  await userSave
    .save()
    .then((data) => {
      return new Response(data, "User created successfully").created(res);
    })
    .catch((error) => {
      console.log("error: ", error);
      throw new APIError("User not created.", 401);
    });
};

// const verifyToken = async (req, res, next) => {
//   const { token } = req.body;
//   if (!token) {
//     throw new APIError("Invalid token", 401);
//   }
//   try {
//     const payload = jwt.verifyToken(token);
//     const user = await User.findOne({ id: payload.id, email: payload.email });
//     if (!user) {
//       throw new APIError("User not found", 404);
//     }

//     Response.success(res, { name: user.name, email: user.email });
//   } catch (err) {
//     throw new APIError("Invalid token", 401);
//   }
// };

const me = async (req, res) => {
  console.log("şuan authController.js deyim");
  //return Response(req.user, "User found").success(res);

  return new Response(req.user, "User found").success(res); //Success response 200 OK
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const userInfo = await User.findOne({ email: email }).select("name surname email phone"); //Find user by email address. Selecten sonra gelecek olan bilgileri seçiyoruz.

  if (!userInfo) {
    throw new APIError("User not found", 401);
  }

  const resetCode = crypto.randomBytes(3).toString("hex"); //Random string oluşturuyoruz.
  console.log(resetCode);

  await send_mail({
    //! Düzenlenecektir..
    from: process.env.EMAIL,
    to: userInfo.email,
    subject: "Reset Password",
    html: `<h1>Reset Password</h1>
    <p>Merhaba ${userInfo.name} ${userInfo.surname}</p>
    <p>Şifrenizi sıfırlamak için aşağıdaki kodu kullanabilirsiniz.</p>
    <p>Kodunuz : ${resetCode}</p>
    <p>İyi günler dileriz.</p>
    `,
  });

  await User.updateOne(
    { email: email },
    {
      reset: {
        code: resetCode,
        time: moment(new Date()).add(15, "minute").format("YYY-MM-DD HH:mm:ss"),
      },
    }
  );
  return new Response(send_mail, "Please mailbox controle").success(res);
};

const resetCodeCheck = async (req, res) => {
  //!Düzenlenebilir
  const { email, code } = req.body;
  console.log("email : ", email);
  console.log("code : ", code);

  const userInfo = await User.findOne({ email: email }).select("_id name surname email phone reset"); //bilgileri seçiyoruz.

  if (!userInfo) {
    throw new APIError("User not found", 401);
  }

  const dbTime = moment(userInfo.reset.time);
  const nowTime = moment(new Date());

  const timeDiff = dbTime.diff(nowTime, "minutes"); //dbTime ile nowTime arasındaki farkı buluyoruz.

  if (timeDiff <= 0) {
    throw new APIError("Code is expired", 401);
  }

  if (userInfo.reset.code !== code) {
    throw new APIError("Invalid code", 401);
  }

  const tempToken = await createTemporaryToken(userInfo._id, userInfo.email); //Kullanıcıya geçici token oluşturuyoruz.
  return new Response({ tempToken }, "Code is valid").success(res);
};

const resetPassword = async (req, res) => {
  const { password, tempToken } = req.body;

  const hashPassword = await bcrypt.hash(password, 10); //resetledikten sonra yine haslıyoruz.
  const decodedToken = await decodedTemporaryToken(tempToken);

  //çözümlenmiş token içerisindeki _id ile kullanıcıyı buluyoruz. Ve sadece şifre bloğunu güncelliyoruz.
  await User.findByIdAndUpdate(
    { _id: decodedToken._id },
    {
      reset: {
        code: null,
        time: null,
      },
      password: hashPassword,
    }
  );

  return new Response(decodedToken, "Password reset successfully").success(res);
};

module.exports = {
  login,
  register,
  me,
  forgetPassword,
  resetCodeCheck,
  resetPassword,
};
