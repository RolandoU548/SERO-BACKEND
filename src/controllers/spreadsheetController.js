import mongoose from "mongoose";
import Spreadsheet from "../models/spreadsheet.js";

export const createSpreadsheet = async (req, res) => {
  try {
    const userId = req.session.user._id;

    if (!req.body.tableData) {
      return res.status(400).json({ message: "Table data is required" });
    }

    const { tableData } = req.body;

    let spreadsheet = await Spreadsheet.findOne({ user: userId });

    if (spreadsheet) {
      spreadsheet.tableData = tableData;
      const updatedSpreadsheet = await spreadsheet.save();
      return res.status(200).json({
        updatedSpreadsheet,
        message: "Spreadsheet updated successfully",
      });
    } else {
      spreadsheet = new Spreadsheet({ user: userId, tableData });
      const savedSpreadsheet = await spreadsheet.save();
      return res.status(201).json({
        savedSpreadsheet,
        message: "Spreadsheet created successfully",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllSpreadsheets = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const spreadsheets = await Spreadsheet.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalSpreadsheets = await Spreadsheet.countDocuments();

    res.status(200).json({
      spreadsheets,
      totalSpreadsheets,
      totalPages: Math.ceil(totalSpreadsheets / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpreadsheetById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Spreadsheet ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const spreadsheet = await Spreadsheet.findById(id);
    if (!spreadsheet) {
      return res.status(404).json({ message: "Spreadsheet not found" });
    }
    res
      .status(200)
      .json({ spreadsheet, message: "Spreadsheet retrieved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSpreadsheetById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Spreadsheet ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Update data is required" });
    }

    const { user, ...updateData } = req.body;

    const updatedSpreadsheet = await Spreadsheet.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedSpreadsheet) {
      return res.status(404).json({ message: "Spreadsheet not found" });
    }
    res.status(200).json({
      updatedSpreadsheet,
      message: "Spreadsheet updated successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSpreadsheetById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Spreadsheet ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const deletedSpreadsheet = await Spreadsheet.findByIdAndDelete(id);
    if (!deletedSpreadsheet) {
      return res.status(404).json({ message: "Spreadsheet not found" });
    }
    res.status(200).json({ message: "Spreadsheet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSpreadsheetByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const spreadsheet = await Spreadsheet.findOne({ user: userId });
    if (!spreadsheet) {
      return res
        .status(404)
        .json({ message: "Spreadsheet not found for the user" });
    }
    res
      .status(200)
      .json({ spreadsheet, message: "Spreadsheet retrieved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnSpreadsheet = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const spreadsheet = await Spreadsheet.findOne({ user: userId });

    if (!spreadsheet) {
      return res.status(404).json({ message: "Spreadsheet not found" });
    }
    res
      .status(200)
      .json({ spreadsheet, message: "Spreadsheet retrieved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOwnSpreadsheet = async (req, res) => {
  try {
    const userId = req.session.user._id;

    // Prevent changing the user field
    const { user, ...updateData } = req.body;

    const updatedSpreadsheet = await Spreadsheet.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSpreadsheet) {
      return res.status(404).json({ message: "Spreadsheet not found" });
    }

    res.status(200).json({
      updatedSpreadsheet,
      message: "Spreadsheet updated successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOwnSpreadsheet = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const deletedSpreadsheet = await Spreadsheet.findOneAndDelete({
      user: userId,
    });

    if (!deletedSpreadsheet) {
      return res.status(404).json({ message: "Spreadsheet not found" });
    }

    res.status(200).json({ message: "Spreadsheet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
