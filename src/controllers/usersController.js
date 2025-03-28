import bcrypt from "bcryptjs";
import User from "../models/user.js";

const createUser = async (req, res) => {
  try {
    const { name, lastname, email, password, role } = req.body;
    if (!name || !lastname || !email || !password || !role) {
      return res.status(400).json({
        message: "Todos los campos requeridos deben ser proporcionados",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "El correo electrónico ya está registrado" });
    }

    req.body.password = await bcrypt.hash(password, 10);
    const user = new User(req.body);
    const savedUser = await user.save();

    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Error de validación", errors: error.errors });
    }
    next(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User no encontrado" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User no encontrado" });
    }
    res.status(200).json({ message: "User eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createUser, getUserById, getAllUsers, updateUserById, deleteUserById };
