import { Capsule } from "../../models/Capsule.model.js";

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
    const { page = 1, limit = 10 } = req.query;
    const capsules = await Capsule.find({ viewRights: "public" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const totalCapsules = await Capsule.countDocuments({ viewRights: "public" });

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
    if (!capsule) return res.status(404).json({ success: false, message: "Capsule not found" });
    res.status(200).json({ success: true, capsule });
  } catch (error) {
    console.error("Error fetching capsule:", error);
    res.status(500).json({ success: false, message: "Failed to fetch capsule" });
  }
};
