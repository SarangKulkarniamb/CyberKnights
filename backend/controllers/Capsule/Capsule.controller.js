import { Capsule } from "../../models/Capsule.model.js";
import { Profile } from "../../models/profile.model.js";
import { User } from "../../models/user.model.js";
import mongoose from "mongoose";

export const CapsuleUpload = async (req, res) => {
  try {
    const { Description, CapsuleName, viewRights, locked, lockedUntil } = req.body;
    if (!CapsuleName || !Description || !viewRights) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const banner = req.file?.path || "https://res.cloudinary.com/default-banner.png";
    const Admin = req.userId;
    if (!Admin) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const capsule = await Capsule.create({
      Description,
      banner,
      CapsuleName,
      viewRights,
      Admin,
      locked: locked === "true" || locked === true,
      lockedUntil: lockedUntil ? new Date(lockedUntil) : undefined,
    });

    res.status(200).json({ success: true, message: "Capsule uploaded", capsule });
  } catch (error) {
    console.error("Error uploading capsule:", error);
    res.status(500).json({ success: false, message: "Failed to upload capsule" });
  }
};

export const getAdminCapsules = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }
    // Query capsules where Admin equals the current user's ID
    const query = { Admin: req.userId };
    const capsules = await Capsule.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, capsules });
  } catch (error) {
    console.error("Error fetching admin capsules:", error);
    res.status(500).json({ success: false, message: "Failed to fetch capsules" });
  }
};

export const getCapsule = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid capsule ID" });
    }

    const capsule = await Capsule.findById(id);
    if (!capsule) {
      return res.status(404).json({ success: false, message: "Capsule not found" });
    }
    const author = capsule.Admin;
    const author_profile = await Profile.findOne({ userid: author });
    res.status(200).json({ success: true, capsule, author_profile });
  } catch (error) {
    console.error("Error fetching capsule:", error);
    res.status(500).json({ success: false, message: "Failed to fetch capsule" });
  }
};

// Update a capsule (admin only)
export const updateCapsule = async (req, res) => {
  try {
    const { CapsuleName, Description, viewRights, locked, lockedUntil } = req.body;
    const updateData = {
      CapsuleName,
      Description,
      viewRights,
      locked: locked === "true" || locked === true,
      lockedUntil: lockedUntil ? new Date(lockedUntil) : null,
    };

    if (req.file) {
      updateData.banner = req.file.filename;
    }

    const updatedCapsule = await Capsule.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedCapsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }
    res.status(200).json({ success: true, capsule: updatedCapsule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a capsule (admin only)
export const deleteCapsule = async (req, res) => {
  try {
    const deletedCapsule = await Capsule.findByIdAndDelete(req.params.id);
    if (!deletedCapsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }
    res.status(200).json({ success: true, message: "Capsule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Grant access by username (admin only)
export const grantAccess = async (req, res) => {
  try {
    const { id } = req.params; // capsule id
    const { username } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const capsule = await Capsule.findById(id);
    if (!capsule) {
      return res.status(404).json({ success: false, message: "Capsule not found" });
    }
    // Check if current user is admin of the capsule
    if (capsule.Admin.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Grant access: add the user's _id if not already present
    if (!capsule.access.includes(user._id)) {
      capsule.access.push(user._id);
      await capsule.save();
    }

    res.status(200).json({ success: true, message: "Access granted successfully", capsule });
  } catch (error) {
    console.error("Error granting access:", error);
    res.status(500).json({ success: false, message: "Failed to grant access" });
  }
};

// Request access to a capsule (non-admin user)
export const requestAccess = async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id);
    if (!capsule)
      return res.status(404).json({ success: false, message: "Capsule not found" });

    if (capsule.viewRights === "public") {
      return res.status(400).json({ success: false, message: "This capsule is already public" });
    }
    if (capsule.viewRights === "onlyMe") {
      return res.status(400).json({ success: false, message: "This capsule is private" });
    }

    if (capsule.Admin.toString() === req.userId) {
      return res.status(400).json({ success: false, message: "You are the admin of this capsule. Head to dashboard to manage this capsule." });
    }

    if (capsule.requests.includes(req.userId)) {
      return res.status(400).json({ success: false, message: "Request already sent" });
    }

    capsule.requests.push(req.userId);
    await capsule.save();
    res.status(200).json({ success: true, message: "Request sent" });
  } catch (error) {
    console.error("Error requesting access:", error);
    res.status(500).json({ success: false, message: "Failed to request access" });
  }
};

// Unlock capsule (after countdown is over)
export const unlockCapsule = async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id);
    if (!capsule) {
      return res.status(404).json({ success: false, message: "Capsule not found" });
    }
    if (!capsule.lockedUntil) {
      return res.status(400).json({ success: false, message: "No lockedUntil date set" });
    }
    const now = new Date();
    const lockedUntil = new Date(capsule.lockedUntil);
    if (now < lockedUntil) {
      return res.status(400).json({ success: false, message: "Countdown is not over yet" });
    }
    capsule.locked = false;
    await capsule.save();
    res.status(200).json({ success: true, message: "Capsule unlocked successfully", capsule });
  } catch (error) {
    console.error("Error unlocking capsule:", error);
    res.status(500).json({ success: false, message: "Failed to unlock capsule" });
  }
};


export const getCapsules = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const query = search ? { CapsuleName: { $regex: search, $options: "i" } } : {};

    const capsules = await Capsule.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const totalCapsules = await Capsule.countDocuments(query);
    res.status(200).json({
      success: true,
      capsules,
      hasMore: pageNum * limitNum < totalCapsules,
    });
  } catch (error) {
    console.error("Error fetching capsules:", error);
    res.status(500).json({ success: false, message: "Failed to fetch capsules" });
  }
};