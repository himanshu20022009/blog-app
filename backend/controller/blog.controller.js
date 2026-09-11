import mongoose, { mongo } from "mongoose";
import { Blog } from "../models/blog.model.js";
import { v2 as cloudinary } from "cloudinary";

const normalizeBlog = (blog) => {
  const normalizedBlog = blog.toObject ? blog.toObject() : blog;
  if (typeof normalizedBlog.blogImage === "string") {
    normalizedBlog.blogImage = {
      public_id: "",
      url: normalizedBlog.blogImage,
    };
  }
  return normalizedBlog;
};

export const createBlog = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Blog Image is required" });
    }

    const { blogImage } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(blogImage.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only jpg and png are allowed",
      });
    }

    const { title, category, about } = req.body;
    if (!title || !category || !about) {
      return res
        .status(400)
        .json({ message: "title, category & about are required fields" });
    }

    if (about.trim().length < 200) {
      return res.status(400).json({
        message: "Blog content should contain at least 200 characters.",
      });
    }

    const adminName = req?.user?.name;
    const adminPhoto = req?.user?.photo?.url;
    const createdBy = req?.user?._id;

    if (!createdBy || !adminName) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      blogImage.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse?.error || "Cloudinary upload failed");
      return res.status(500).json({ message: "Image upload failed" });
    }

    const blogData = {
      title,
      about,
      category,
      adminName,
      adminPhoto,
      createdBy,
      blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    };

    const blog = await Blog.create(blogData);

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.log(error);

    if (error?.name === "ValidationError") {
      return res.status(400).json({
        message: error.message || "Blog validation failed",
      });
    }

    return res.status(500).json({ error: "Internal Server error" });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  await blog.deleteOne();
  res.status(200).json({ message: "Blog deleted successfully" });
};

export const getAllBlogs = async (req, res) => {
  const allBlogs = await Blog.find().sort({ _id: -1 });
  res.status(200).json(allBlogs.map(normalizeBlog));
};

export const getSingleBlogs = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json(normalizeBlog(blog));
};

export const getMyBlogs = async (req, res) => {
  const createdBy = req.user._id;
  const myBlogs = await Blog.find({ createdBy });
  res.status(200).json(myBlogs.map(normalizeBlog));
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedBlog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json(updatedBlog);
};
