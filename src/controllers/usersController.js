import bcrypt from "bcryptjs";
import User from "../models/user.js";

const createUser = async (req, res, next) => {
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

    const {
      password: _,
      refreshToken: __,
      ...userWithoutPasswordAndToken
    } = savedUser.toObject();
    res.status(201).json(userWithoutPasswordAndToken);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Error de validación", errors: error.errors });
    }
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser && existingUser._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "El email ya está en uso" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User no encontrado" });
    }

    const {
      password: _,
      refreshToken: __,
      ...userWithoutPasswordAndToken
    } = updatedUser.toObject();
    res.status(200).json(userWithoutPasswordAndToken);
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User no encontrado" });
    }
    res.status(200).json({ message: "User eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

export { createUser, getUserById, getAllUsers, updateUserById, deleteUserById };
