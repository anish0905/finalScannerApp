const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const QrGeneraterBoySignup = require("../models/qrGeneraterBoySignupModel");

// @desc Register a new user
// @route POST /api/users/register
// @access Public
const registerQrGeneraterBoy = asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword, phoneNo, address, pinCode,
        state,city, stockistEmailId } = req.body;

    if (!username || !email || !password || !confirmPassword || !pinCode || !address || !state  || !phoneNo || !city) {
        res.status(400).json({ error: "All fields are mandatory!" });
        return;
    }

    if (password !== confirmPassword) {
        res.status(400).json({ error: "Passwords do not match!" });
        return;
    }

    const existingUser = await QrGeneraterBoySignup.findOne({ email });

    if (existingUser) {
        res.status(400).json({ error: "User already registered!" });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await QrGeneraterBoySignup.create({
        username,
        email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        phoneNo,
        address,
        city,
        pinCode,
        state,

        stockistEmailId,
    });

    if (newUser) {
        res.status(201).json({
            id: newUser._id,
            email: newUser.email,
        });
    } else {
        res.status(400).json({ error: "User registration failed" });
    }
});

// @desc Login a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required!" });
        return;
    }

    const user = await QrGeneraterBoySignup.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const  deliveryBoyToken  = jwt.sign(
            {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m", // Token expiration
            }
        );

        res.status(200).json({ deliveryBoyToken,id:user._id, email:user.email });
    } else {
        res.status(401).json({ error: "Invalid email or password" });
    }
});

// @desc Get current user info
// @route GET /api/users/current
// @access Private (requires token authentication)
const currentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  
    res.status(200).json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      // Add any other user-specific information you'd like to return
    });
  });
  

  const getAllDeliveryBoyDeatils = asyncHandler(async (req, res) => {
    const getAllDeliveryBoyDeatils = await QrGeneraterBoySignup.find();
    res.status(200).json(getAllDeliveryBoyDeatils)
  });

module.exports = { registerQrGeneraterBoy, loginUser, currentUser,getAllDeliveryBoyDeatils };