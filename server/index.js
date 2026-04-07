const express = require("express");
const cors = require("cors");
const pool = require("./db");
require('dotenv').config();
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const app = express();

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS registration_step VARCHAR(20) DEFAULT '1'`);
    await pool.query(`ALTER TABLE users ALTER COLUMN registration_step TYPE VARCHAR(20) USING registration_step::text`);
    await pool.query(`ALTER TABLE users ALTER COLUMN registration_step SET DEFAULT '1'`);
  } catch (err) {
    console.error("Migration error:", err);
  }
})();

/* ===============================
   USERNAME GENERATOR
================================= */
const generateUsername = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM users");
  const count = parseInt(result.rows[0].count) + 1;
  return "jsh26" + String(count).padStart(5, "0");
};

/* ===============================
   REGISTER API
================================= */
app.post("/register", async (req, res) => {
  try {
    const { full_name, email, mobile } = req.body;

    const username = await generateUsername();

    await pool.query(
      `INSERT INTO users
      (username, full_name, email, mobile, state, district, city, pincode, gender, password, registration_step)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [username, full_name, email, mobile, null, null, null, null, null, null, '1']
    );

    res.json({ success: true, message: "Registered Successfully", username });
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please use a different email.",
      });
    }

    res.status(500).json({ success: false, message: "Error registering" });
  }
});

/* ===============================
   UPDATE STEP 2
================================= */
app.post("/update-step2", async (req, res) => {
  try {
    const { username, state, district, city, pincode, gender, password } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET state = $1, district = $2, city = $3, pincode = $4, gender = $5, password = $6, registration_step = '2'
       WHERE username = $7`,
      [state, district, city, pincode, gender, password, username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Step 2 saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating step 2" });
  }
});

/* ===============================
   UPDATE STEP 3
================================= */
app.post("/update-step3", async (req, res) => {
  try {
    const { username, team_name, team_members } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET team_name = $1, team_members = $2, registration_step = '3'
       WHERE username = $3`,
      [team_name, team_members, username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Step 3 saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating step 3" });
  }
});

/* ===============================
   FINAL SUBMIT
================================= */
app.post("/final-submit", async (req, res) => {
  try {
    const { username } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await pool.query(
      `UPDATE users
       SET registration_step = 'completed'
       WHERE username = $1`,
      [username]
    );

    res.json({ success: true, message: "Registration complete" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error finalizing registration" });
  }
});

/* ===============================
   USER PROGRESS
================================= */
app.get("/user-progress", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, message: "Username is required" });
  }

  try {
    const result = await pool.query(
      `SELECT full_name, email, mobile, state, district, city, pincode, gender, team_name, team_members, registration_step
       FROM users
       WHERE username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error loading user progress" });
  }
});

/* ===============================
   OTP RECEIPT
================================= */
app.post("/send-otp", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "User not found ❌",
      });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.json({
        success: false,
        message: "Invalid username or password ❌",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    global.otpStore = global.otpStore || {};
    global.otpStore[username] = otp;

    console.log("OTP:", otp); // 🔥 check in terminal

    // Send OTP via email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && !process.env.EMAIL_USER.includes('yourgmail')) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Your OTP for Login',
        text: `Your OTP is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email send error:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }

    // Send OTP via SMS
    if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER && process.env.TWILIO_SID.startsWith('AC')) {
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

      client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${user.mobile}`, // Assuming Indian mobile, adjust country code
      }).then(message => console.log('SMS sent:', message.sid))
        .catch(error => console.error('SMS send error:', error));
    }

    const response = {
      success: true,
      message: "OTP sent",
    };

    if (process.env.NODE_ENV !== "production") {
      response.otp = otp;
    }

    res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Verify OTP

app.post("/verify-otp", async (req, res) => {
  const { username, otp } = req.body;

  if (
    !global.otpStore ||
    global.otpStore[username] != otp
  ) {
    return res.json({
      success: false,
      message: "Invalid OTP ❌",
    });
  }

  res.json({
    success: true,
    message: "Login successful",
  });
});


/* ===============================
   LOGIN API
================================= */


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "User not registered ❌",
      });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.json({
        success: false,
        message: "Wrong password ❌",
      });
    }

    res.json({
      success: true,
      message: "Login successful ✅",
      username: user.username,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error ❌",
    });
  }
});

/* ===============================
   TEST ROUTE
================================= */
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

/* ===============================
   SERVER START
================================= */
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});