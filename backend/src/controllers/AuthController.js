const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authConfig = require("../config/auth");

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
}

module.exports = {
  async register(req, res) {
    const { email } = req.body;

    try {
      if (await User.findOne({ email })) {
        return res.status(400).json({ error: "User already exists" });
      }
      const user = await User.create(req.body);

      user.password = undefined;

      return res.json({
        user,
        token: generateToken({ id: user.id })
      });
    } catch (err) {
      return res.status(400).json({ error: "Registration failed" });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid password" });
    }

    user.password = undefined;

    return res.json({
      user,
      token: generateToken({ id: user.id })
    });
  }
};
