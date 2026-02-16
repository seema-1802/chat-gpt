import express from "express";
import User from "../models/user.js";

import passport from "passport";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { Name, Email, Password } = req.body;

  if (!Name || !Email || !Password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const exist = await User.findOne({ Email });
    if (exist) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = new User({ Name, Email });
    const registeredUser = await User.register(newUser, Password);


    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: registeredUser._id,
        Name: registeredUser.Name,
        Email: registeredUser.Email,
        ProfileImage: registeredUser.ProfileImage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", (req, res, next) => {
  const { Email, Password } = req.body;   // <-- ye missing tha

  if (!Email || !Password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  req.body.username = Email;
  req.body.password = Password;

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid email or password" });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ error: "Login failed" });
      }

      res.json({
        message: "Logged in successfully",
        user: {
          id: user._id,
          Name: user.Name,
          Email: user.Email,
        },
      });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

export default router;
