import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, lastname, email, password, role } = req.body;
    if (!name || !lastname || !email || !password || !role) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    req.body.password = await bcrypt.hash(password, 10);
    const user = new User(req.body);
    const savedUser = await user.save();

    const {
      password: _,
      refreshToken: __,
      ...userWithoutPasswordAndToken
    } = savedUser.toObject();

    res.status(201).json({
      user: userWithoutPasswordAndToken,
      message: "A user has been created",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const user = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const query = role ? { role } : {};

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    // Validar si la página solicitada está fuera del rango
    if (page > totalPages && totalUsers > 0) {
      return res.status(400).json({
        message: `Page ${page} exceeds the total number of pages (${totalPages}).`,
      });
    }

    const users = await User.find(query)
      .select("-password -refreshToken")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      users,
      totalUsers,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const { _id, email, password, role, ...updateData } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      password: _,
      refreshToken: __,
      ...userWithoutPasswordAndToken
    } = updatedUser.toObject();

    res.status(200).json({
      user: userWithoutPasswordAndToken,
      message: "A user has been updated",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getOwnUser = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateOwnUser = async (req, res, next) => {
  try {
    const { _id, email, password, role, ...updateData } = req.body; // Exclude _id, email, password and role from updates

    const userId = req.session.user._id;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
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

export const deleteOwnUser = async (req, res, next) => {
  try {
    const userId = req.session.user._id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both password and newPassword are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
