import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      role,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error registering user",
      error: err.message,
    });
  }
};


/* ================= LOGIN ================= */

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    if (user.role !== role) {
      return res.status(400).json({
        message: "User does not have the correct role",
        success: false,
      });
    }

    /* ===== JWT TOKEN CREATION ===== */

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    /* ===== Remove Sensitive Data ===== */

    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: `Welcome Back ${user.fullname}`,
        user: safeUser,
        success: true,
      });

  } catch (err) {
    return res.status(500).json({
      message: "Error logging in user",
      error: err.message,
    });
  }
};


/* ================= LOGOUT ================= */

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error logging out user",
      error: err.message,
    });
  }
};


/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    const userId = req.id; 

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    
    if (!user.profile) {
      user.profile = {};
    }

    /* ===== Update only fields that are provided ===== */

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;

    if (skills) {
      user.profile.skills = skills
        .split(",")
        .map(skill => skill.trim());
    }

    // 👉 Future: Handle file upload (resume / profile image)
    // if (file) {
    //   const fileUrl = await uploadToCloudinary(file.path);
    //   user.profile.resume = fileUrl;
    // }

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};
