import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const login = async (req, res) => {
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

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "15d",
      }
    );

    const publicUser = {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
      status: user.status,
      phone: user.phone,
      address: user.address,
      birthday: user.birthday,
    };

    res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24 * 15,
      })
      .status(200)
      .json({
        user: publicUser,
        token,
        message: "Inicio de sesión exitoso",
      });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

const logout = async (req, res) => {
  res
    .clearCookie("refresh_token")
    .status(200)
    .json({ message: "Sesión cerrada exitosamente" });
};

export { login, logout };
