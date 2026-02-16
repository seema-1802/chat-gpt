import express from "express";
import cors from "cors";
import 'dotenv/config';
import fetch from "node-fetch"; 
import mongoose from "mongoose";
import chatRoutes from "../backened/routes/chat.js"
import authRoutes from "../backened/routes/user.js";
import session from "express-session";
import passport from "passport";

import User from "../backened/models/user.js";


const app = express();
const port = 8080;

app.use(express.json()); 
app.use(cors());

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());



// passport config
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






// routes

app.use("/api", authRoutes);


app.use("/api",chatRoutes);


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Server successfully connected with database");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.log("Failed to connect with DB", err);
  }
};

connectDB();

   


































































































































// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini", 
//             messages: [{
//                 role: "user",
//                 content: req.body.message,
//             }]
//         })
//     };

//     try {
//        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         console.log(data.choices[0].message.content);
//         res.send(data.choices[0].message.content);
//     } catch (err) {
//         console.error("Error occurred:", err);
//         res.status(500).send({ error: "Something went wrong" });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
