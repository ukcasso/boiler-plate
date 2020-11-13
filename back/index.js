const express = require('express');
const { sequelize, User } = require("./models");
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// application  x-www-form-urlendcoded
app.use(bodyParser.urlencoded({extended: true}));
// application  json
app.use(bodyParser.json());
app.use(cookieParser());

sequelize
 .sync({ force: false })
 .then(() => {
   console.log("db is connected");
 })
 .catch((err) => {
   console.log(err)
 }); 


app.get('/', (req, res) => res.send("nodemon!"));


app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  // 회원가입시 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다.
  try {
    // 이미 email이 있는 경우를 방지
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      res.status(500).json({ error: "중복되는 이메일입니다." });
    }
    // 비밀번호 암호화 하기위한 해쉬 값
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hash,
      role: 0
    })
    res.status(201).json({ sucess: "true "})
  } catch(err) {
    res.status(500).json({ error: err.message })
  }  
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if(!user) {
    res.status(500).json({ error: "해당하는 유저가 없습니다."})
  }
  // 비밀번호 비교
  bcrypt.compare(password, user.password).then((isMatch) => {
    if(isMatch) {
          const payload = { id: user.id };
          jwt.sign(payload, 'secretString', {
            expiresIn: "24h"
          }, 
          (err, token) => { 
            res.cookie("token", token);
            res.json({
            id: user.id,
            token: token,
            loginSuccess: true,
            message: "로그인 되었습니다."
          })
        }
      );
    } else { res.status(400).json({ loginSuccess: false, message: "패스워드가 틀립니다."}) }
  })

})

app.listen(port, () => console.log(`server is running on port ${port}`));