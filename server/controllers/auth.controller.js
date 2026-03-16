import User from "../models/User.js";
import Patient from "../models/patient.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { fullName, email, phone, password, dateOfBirth, role, specialization, address } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      dateOfBirth,
      role: role || "patient",
      specialization,
      address,
      isApproved: role && role !== "patient", // Auto-approve staff
    });

    // Automatically create a Patient record if they are a patient
    if (user.role === "patient") {
      await Patient.create({
        fullName,
        email,
        phone,
        age: dateOfBirth ? Math.floor((Date.now() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0,
      });
    }

    res.status(201).json({
      token: generateToken(user._id.toString(), user.role),
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        specialization: user.specialization,
        address: user.address,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      token: generateToken(user._id.toString(), user.role),
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        specialization: user.specialization,
        address: user.address,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= GET ALL USERS ================= */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ================= UPDATE USER ================= */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isApproved, isActive, fullName, email, phone, dateOfBirth, specialization, address } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (isApproved !== undefined) user.isApproved = isApproved;
    if (isActive !== undefined) user.isActive = isActive;
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (specialization !== undefined) user.specialization = specialization;
    if (address !== undefined) user.address = address;

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        specialization: user.specialization,
        address: user.address,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};