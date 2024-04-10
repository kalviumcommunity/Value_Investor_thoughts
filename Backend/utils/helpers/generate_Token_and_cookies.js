const jwt = require("jsonwebtoken");


const generate = (newUser, res) => {
  const token = jwt.sign(
    {
      id: newUser.id,
      firstName: newUser.firstName,
      email: newUser.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 1000 * 3600 * 240,
    secure: true,
    sameSite: 'strict'
  });
};

module.exports.generateToken = generate;


