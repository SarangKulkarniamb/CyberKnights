import { Capsule } from "../../models/Capsule.model.js";
import { Profile } from "../../models/profile.model.js";

export const CapsuleUpload = async (req, res) => {
  try {
    const { Description, CapsuleName, viewRights } = req.body;
    if (!CapsuleName || !Description || !viewRights) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const banner = req.file?.path || "https://res.cloudinary.com/default-banner.png";
    const Admin = req.userId;
    if (!Admin) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const capsule = await Capsule.create({ Description, banner, CapsuleName, viewRights, Admin });

    res.status(200).json({ success: true, message: "Capsule uploaded", capsule });
  } catch (error) {
    console.error("Error uploading capsule:", error);
    res.status(500).json({ success: false, message: "Failed to upload capsule" });
  }
};

export const getCapsules = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const query = search ? { CapsuleName: { $regex: search, $options: "i" } } : {};

    const capsules = await Capsule.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCapsules = await Capsule.countDocuments(query);

    res.status(200).json({
      success: true,
      capsules,
      hasMore: page * limit < totalCapsules,
    });
  } catch (error) {
    console.error("Error fetching capsules:", error);
    res.status(500).json({ success: false, message: "Failed to fetch capsules" });
  }
};

export const getCapsule = async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id);
    const author= capsule.Admin
    const author_profile = await Profile.findOne({ userid: author })
    if (!capsule) return res.status(404).json({ success: false, message: "Capsule not found" });
    res.status(200).json({ success: true, capsule ,author_profile });
  } catch (error) {
    console.error("Error fetching capsule:", error);
    res.status(500).json({ success: false, message: "Failed to fetch capsule" });
  }
};

export const updateCapsule = async (req, res) => {
  try {
    const { Description, CapsuleName, viewRights } = req.body;
    const banner = req.file?.path;
    const capsule = await Capsule.findByIdAndUpdate(
      req.params.id,
      { Description, banner, CapsuleName, viewRights },
      { new: true }
    );

    if (!capsule) return res.status(404).json({ success: false, message: "Capsule not found" });
    res.status(200).json({ success: true, message: "Capsule updated", capsule });
  } catch (error) {
    console.error("Error updating capsule:", error);
    res.status(500).json({ success: false, message: "Failed to update capsule" });
  }
};

export const deleteCapsule = async (req, res) => {
  try {
    const capsule = await Capsule.findByIdAndDelete(req.params.id);
    if (!capsule) return res.status(404).json({ success: false, message: "Capsule not found" });
    res.status(200).json({ success: true, message: "Capsule deleted" });
  } catch (error) {
    console.error("Error deleting capsule:", error);
    res.status(500).json({ success: false, message: "Failed to delete capsule" });
  }
};

export const getMyCapsules = async (req, res) => {
  try {
    const capsules = await Capsule.find({ Admin: req.userId });
    res.status(200).json({ success: true, capsules });
  } catch (error) {
    console.error("Error fetching capsules:", error);
    res.status(500).json({ success: false, message: "Failed to fetch capsules" });
  }
};

export const searchCapsules = async (req, res) => {
  try {
    const { query } = req.query;
    const capsules = await Capsule.find({ CapsuleName: { $regex: query, $options: "i" } });
    res.status(200).json({ success: true, capsules });
  } catch (error) {
    console.error("Error searching capsules:", error);
    res.status(500).json({ success: false, message: "Failed to search capsules" });
  }
};

export const requestAccess = async (req, res) => {
    try {
        const capsule = await Capsule.findById(req.params.id);
        if (!capsule) return res.status(404).json({ success: false, message: "Capsule not found" });
    
        if (capsule.viewRights === "public") {
            return res.status(400).json({ success: false, message: "This capsule is already public" });
        }
        if(capsule.viewRights === "onlyMe"){
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
    }

    export const grantAccess = async (req, res) => {
    try {
        const capsule = await Capsule.findById(req.params.id);
        if (!capsule) return res.status(404).json({ success: false, message: "Capsule not found" });
    
        if (capsule.Admin.toString() !== req.userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    
        if (!capsule.requests.includes(req.body.userId)) {
        return res.status(400).json({ success: false, message: "No request found" });
        }
    
        capsule.requests = capsule.requests.filter((id) => id.toString() !== req.body.userId);
        capsule.access.push(req.body.userId);
        await capsule.save();
        res.status(200).json({ success: true, message: "Access granted" });
    } catch (error) {
        console.error("Error granting access:", error);
        res.status(500).json({ success: false, message: "Failed to grant access" });
    }
    }
