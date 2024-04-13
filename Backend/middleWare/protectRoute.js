const jwt = require("jsonwebtoken");

const protectRoute = async (req, res, next) => {
  try {
    const {token} = req.headers;
    if (!token) return res.status(401).json({ error: "yes" });
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = decoded;
    next();
  } catch (error) {
    res.status(500).json({error: "No data from decoded" });
    console.log("Error from protectRoute:", error.message);
  }
}


exports.protectRoute = protectRoute;
