import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
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
        maxAge: 1000 * 60 * 60 * 24 * 15,
      })
      .status(200)
      .json({
        user: userWithoutPasswordAndToken,
        accessToken,
        message: "Inicio de sesión exitoso",
      });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res
    .clearCookie("refresh_token")
    .status(200)
    .json({ message: "Sesión cerrada exitosamente" });
};

export { login, logout };
