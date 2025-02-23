import Post from "../../models/Post.model.js";
import {Capsule} from "../../models/Capsule.model.js";

export const PostUpload = async (req, res) => {
  try {
    const { title, content, capsuleId } = req.body;
    if (!title || !content || !capsuleId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const capsule = await Capsule.findById(capsuleId);
    if (!capsule) {
      return res.status(404).json({
        success: false,
        message: "Capsule not found",
      });
    }
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Access check:
    // - If the capsule is public, anyone can post.
    // - Otherwise, only allow if the user is the Admin or is in the capsule.access array.
    if (
      capsule.viewRights !== "public" &&
      capsule.Admin.toString() !== userId &&
      !capsule.access.includes(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to post in this capsule",
      });
    }
    const media = req.file?.path || null;

    const post = await Post.create({
      title,
      content,
      media,
      capsule: capsuleId,
      user: userId,
    });

    res.status(200).json({
      success: true,
      message: "Post uploaded",
      post,
    });
  } catch (error) {
    console.error("Error uploading post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload post",
    });
  }
};

export const posts = async (req, res) => {
  const { page = 1, limit = 5, capsuleId } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const query = {};
  if (capsuleId) {
    query.capsule = capsuleId;
  }

  try {
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    const totalPosts = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      posts,
      hasMore: pageNum * limitNum < totalPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

export const post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post",
    });
  }
};



