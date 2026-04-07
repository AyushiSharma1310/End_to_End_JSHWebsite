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
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'participant'`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS dashboard_access BOOLEAN DEFAULT false`);
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
      (username, full_name, email, mobile, state, district, city, pincode, gender, password, registration_step, role)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [username, full_name, email, mobile, null, null, null, null, null, null, '1', 'participant']
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
   UPDATE STEP 3 - PROPOSAL DETAILS
================================= */
app.post("/update-step3", async (req, res) => {
  try {
    const { username, category, organization, organization_address, project_investigator_name, project_investigator_designation } = req.body;
    console.log("Update step 3 called for username:", username);

    const result = await pool.query(
      `UPDATE users
       SET category = $1, organization = $2, organization_address = $3, project_investigator_name = $4, project_investigator_designation = $5, registration_step = '3'
       WHERE username = $6`,
      [category, organization, organization_address, project_investigator_name, project_investigator_designation, username]
    );

    console.log("Update step 3 result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Step 3 saved" });
  } catch (err) {
    console.error("Error updating step 3:", err);
    res.status(500).json({ success: false, message: "Error updating step 3" });
  }
});

/* ===============================
   UPDATE STEP 4 - PARTNER DETAILS
================================= */
app.post("/update-step4", async (req, res) => {
  try {
    const { username, partner_organization, partner_address, partner_investigator_name, partner_investigator_email, partner_investigator_mobile } = req.body;
    console.log("Update step 4 called for username:", username);

    const result = await pool.query(
      `UPDATE users
       SET partner_organization = $1, partner_address = $2, partner_investigator_name = $3, partner_investigator_email = $4, partner_investigator_mobile = $5, registration_step = '4'
       WHERE username = $6`,
      [partner_organization, partner_address, partner_investigator_name, partner_investigator_email, partner_investigator_mobile, username]
    );

    console.log("Update step 4 result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Step 4 saved" });
  } catch (err) {
    console.error("Error updating step 4:", err);
    res.status(500).json({ success: false, message: "Error updating step 4" });
  }
});

/* ===============================
   UPDATE STEP 5 - PROPOSAL CONTENT
================================= */
app.post("/update-step5", async (req, res) => {
  try {
    const { username, proposal_title, problem_statement, additional_info } = req.body;
    console.log("Update step 5 called for username:", username);

    const result = await pool.query(
      `UPDATE users
       SET proposal_title = $1, problem_statement = $2, additional_info = $3, registration_step = '5'
       WHERE username = $4`,
      [proposal_title, problem_statement, additional_info, username]
    );

    console.log("Update step 5 result:", result.rowCount, "rows affected");

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Step 5 saved" });
  } catch (err) {
    console.error("Error updating step 5:", err);
    res.status(500).json({ success: false, message: "Error updating step 5" });
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
      `SELECT full_name, email, mobile, state, district, city, pincode, gender, category, organization, organization_address, project_investigator_name, project_investigator_designation, partner_organization, partner_address, partner_investigator_name, partner_investigator_email, partner_investigator_mobile, proposal_title, problem_statement, additional_info, registration_step, role
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

  try {
    const result = await pool.query(
      "SELECT role, dashboard_access, registration_step FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "User not found ❌",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      role: result.rows[0].role,
      dashboard_access: result.rows[0].dashboard_access,
      registration_step: result.rows[0].registration_step,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
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
   CREATE ADMIN
================================= */
app.post("/create-admin", async (req, res) => {
  try {
    const { full_name, email, mobile, password, dashboard_access = false } = req.body;

    // Check if admin already exists
    const existingAdmin = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND role = 'admin'",
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this email",
      });
    }

    const username = await generateUsername();

    await pool.query(
      `INSERT INTO users
      (username, full_name, email, mobile, password, role, registration_step, dashboard_access)
      VALUES ($1, $2, $3, $4, $5, 'admin', 'completed', $6)`,
      [username, full_name, email, mobile, password, dashboard_access]
    );

    res.json({
      success: true,
      message: "Admin created successfully",
      username,
      dashboard_access
    });
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating admin"
    });
  }
});

/* ===============================
   MIDDLEWARE: CHECK ADMIN ROLE
================================= */
const requireAdmin = async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  try {
    const result = await pool.query(
      "SELECT role FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (result.rows[0].role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ===============================
   MIDDLEWARE: CHECK DASHBOARD ACCESS
================================= */
const requireDashboardAccess = async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  try {
    const result = await pool.query(
      "SELECT role, dashboard_access FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = result.rows[0];

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    if (!user.dashboard_access) {
      return res.status(403).json({
        success: false,
        message: "Dashboard access not granted"
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ===============================
   ADMIN DASHBOARD DATA
================================= */
app.get("/admin/dashboard", requireDashboardAccess, async (req, res) => {
  try {
    // Get total participants
    const totalParticipants = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'participant'"
    );

    // Get registration statistics
    const registrationStats = await pool.query(
      "SELECT registration_step, COUNT(*) FROM users WHERE role = 'participant' GROUP BY registration_step"
    );

    // Get recent registrations
    const recentRegistrations = await pool.query(
      "SELECT username, full_name, email, registration_step, created_at FROM users WHERE role = 'participant' ORDER BY created_at DESC LIMIT 10"
    );

    res.json({
      success: true,
      data: {
        totalParticipants: parseInt(totalParticipants.rows[0].count),
        registrationStats: registrationStats.rows,
        recentRegistrations: recentRegistrations.rows
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data"
    });
  }
});

/* ===============================
   GET ALL ADMINS (ADMIN ONLY)
================================= */
app.get("/admin/list", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT username, full_name, email, mobile, dashboard_access, created_at
       FROM users
       WHERE role = 'admin'
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching admins"
    });
  }
});

/* ===============================
   GRANT DASHBOARD ACCESS (ADMIN ONLY)
================================= */
app.post("/admin/grant-dashboard-access", requireAdmin, async (req, res) => {
  try {
    const { admin_username, granted_by } = req.body;

    if (!admin_username) {
      return res.status(400).json({
        success: false,
        message: "Admin username is required"
      });
    }

    // Verify the admin exists and is actually an admin
    const adminCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND role = 'admin'",
      [admin_username]
    );

    if (adminCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Grant dashboard access
    await pool.query(
      "UPDATE users SET dashboard_access = true WHERE username = $1",
      [admin_username]
    );

    res.json({
      success: true,
      message: `Dashboard access granted to ${admin_username}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error granting dashboard access"
    });
  }
});

/* ===============================
   REVOKE DASHBOARD ACCESS (ADMIN ONLY)
================================= */
app.post("/admin/revoke-dashboard-access", requireAdmin, async (req, res) => {
  try {
    const { admin_username, revoked_by } = req.body;

    if (!admin_username) {
      return res.status(400).json({
        success: false,
        message: "Admin username is required"
      });
    }

    // Verify the admin exists
    const adminCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND role = 'admin'",
      [admin_username]
    );

    if (adminCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Revoke dashboard access
    await pool.query(
      "UPDATE users SET dashboard_access = false WHERE username = $1",
      [admin_username]
    );

    res.json({
      success: true,
      message: `Dashboard access revoked from ${admin_username}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error revoking dashboard access"
    });
  }
});

/* =============================== 
   MIDDLEWARE: CHECK OWNER ROLE
================================= */
const requireOwner = async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  try {
    const result = await pool.query(
      "SELECT role FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (result.rows[0].role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: "Owner access required"
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ===============================
   OWNER: GET ALL USERS
================================= */
app.get("/owner/users", requireOwner, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT username, full_name, email, role, dashboard_access, created_at FROM users ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      users: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching users"
    });
  }
});

/* ===============================
   OWNER: GRANT ADMIN ACCESS
================================= */
app.post("/owner/grant-admin", requireOwner, async (req, res) => {
  const { targetUsername } = req.body;

  if (!targetUsername) {
    return res.status(400).json({
      success: false,
      message: "Target username required"
    });
  }

  try {
    // Check if target user exists
    const userCheck = await pool.query(
      "SELECT role FROM users WHERE username = $1",
      [targetUsername]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Target user not found"
      });
    }

    if (userCheck.rows[0].role === 'owner') {
      return res.status(400).json({
        success: false,
        message: "Cannot modify owner role"
      });
    }

    // Update user to admin with dashboard access
    await pool.query(
      "UPDATE users SET role = 'admin', dashboard_access = true WHERE username = $1",
      [targetUsername]
    );

    res.json({
      success: true,
      message: `Admin access granted to ${targetUsername}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error granting admin access"
    });
  }
});

/* ===============================
   OWNER: REVOKE ADMIN ACCESS
================================= */
app.post("/owner/revoke-admin", requireOwner, async (req, res) => {
  const { targetUsername } = req.body;

  if (!targetUsername) {
    return res.status(400).json({
      success: false,
      message: "Target username required"
    });
  }

  try {
    // Check if target user exists
    const userCheck = await pool.query(
      "SELECT role FROM users WHERE username = $1",
      [targetUsername]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Target user not found"
      });
    }

    if (userCheck.rows[0].role === 'owner') {
      return res.status(400).json({
        success: false,
        message: "Cannot modify owner role"
      });
    }

    // Update user back to participant
    await pool.query(
      "UPDATE users SET role = 'participant', dashboard_access = false WHERE username = $1",
      [targetUsername]
    );

    res.json({
      success: true,
      message: `Admin access revoked from ${targetUsername}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error revoking admin access"
    });
  }
});

/* ===============================
   USER PROFILE ENDPOINTS
================================= */
app.get("/user/profile", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Username required"
    });
  }

  try {
    const result = await pool.query(
      "SELECT username, full_name, email, mobile, state, district, city, pincode, gender, team_name, team_members, registration_step, created_at FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
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