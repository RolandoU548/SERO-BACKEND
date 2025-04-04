import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    user.refreshToken = refreshToken;
    await user.save();

    const {
      password: _,
      refreshToken: __,
      ...userWithoutPasswordAndToken
    } = user.toObject();

    res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(200)
      .json({
        user: userWithoutPasswordAndToken,
        accessToken,
        message: "Logged in successfully",
      });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refresh_token) return res.sendStatus(204);

  const refreshToken = cookies.refresh_token;

  try {
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
      return res
        .clearCookie("refresh_token", {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
        .status(204)
        .json({ message: "Cookie cleared successfully" });
    }
    foundUser.refreshToken = undefined;
    await foundUser.save();
    return res
      .clearCookie("refresh_token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refresh_token)
    return res.status(401).json({ message: "Refresh Token is needed" });

  const refreshToken = cookies.refresh_token;

  try {
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
      return res
        .clearCookie("refresh_token", {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
        .status(401)
        .json({ message: "User not found" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (foundUser._id.toString() !== decoded._id) {
      return res
        .clearCookie("refresh_token", {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
        .status(403)
        .json({ message: "Token is not valid for this user" });
    }

    const accessToken = jwt.sign(
      { _id: foundUser._id, email: foundUser.email, role: foundUser.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const {
      password: _,
      refreshToken: __,
      ...userWithoutPasswordAndToken
    } = foundUser.toObject();

    return res
      .status(200)
      .json({ user: userWithoutPasswordAndToken, accessToken });
  } catch (error) {
    if (error.name === "JsonWebTokenError")
      return res.status(403).json({ message: "Invalid token" });
    if (error.name === "TokenExpiredError")
      return res.status(403).json({ message: "Expired token" });
    next(error);
  }
};

export { login, logout, refreshAccessToken };
