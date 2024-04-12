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

  return token;
};

module.exports.generateToken = generate;
