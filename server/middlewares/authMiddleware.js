const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header missing", success: false });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Token missing", success: false });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Token is not valid", success: false });
      }
      req.user = { id: decoded.id };
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};