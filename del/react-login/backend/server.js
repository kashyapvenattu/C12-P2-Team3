const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mainusers = require("./mongo");

app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/commute");

// Secret key for JWT
const JWT_SECRET = "your_secret_key";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// Hash password middleware
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Login
app.post("/api/login", async (req, res) => {
  const { userName, password } = req.body;
    console.log("Login request received:", { userName, password });
  const user = await mainusers.findOne({ userName: userName });
    console.log("User called to login to the database:", userName, password);
  if (!user) return res.status(404).json({ message: "User not found" });
  console.log("this is the username I want to see",user);

  const validPassword = await bcrypt.compare(password, user.password);
  console.log("Password validation:", validPassword);
  if (!validPassword)
    return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  console.log("Token generated:", token);
  res.json({ token });
});

// Signup
app.post("/api/signup", async (req, res) => {
  const { userName, password } = req.body;
  const hashedPassword = await hashPassword(password);

  const existingUser = await mainusers.findOne({ userName: userName });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  mainusers.create({ userName, password: hashedPassword })
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ message: "Error creating user" }));
});

// Protected route example
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected route accessed" });
});

app.listen(PORT, () =>
  console.log(`server is running on port" ${PORT}`)
);
