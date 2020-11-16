// const { User } = require("../models");
// const jwt = require("jsonwebtoken");


// let auth = (req, res, next) => {
//   // 인증처리 하는 곳

//   // 1. client cookie token가져오기
//   let token = req.cookies.token;

//   // 2. token 복호화 한 후 user를 찾는다.
//   jwt.verify(token, 'secretString', function(err, decoded) {
//     // user id를 이용해서 유저를 찾은다음 클라이언트에서 가져온 token과 db에 보관된 토큰이
//     // 일치하는지 확인
//     User.findOne({ where: { id: decoded, token: token } }, (err, user) => {
//       if(err) return err;
//       user;
//     })
//   })

//   // 3. user가 있으면 인증 okay, 없으면 no
//   if(err) throw err;
//   if(!user) return res.json({ isAuth: false, error: true })

//   req.token = token;
//   req.user = user;
//   next();
// }

// module.exports = { auth };

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return (res.status(401).json({ msg: "토큰이없어요" }));

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(401).json({ msg: "입장못해요" });

    req.user = verified.id;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = auth;
