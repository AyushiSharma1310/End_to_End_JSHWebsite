import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // ✅ NEW
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ NEW

  /* ===============================
     BROWSER BACK BUTTON HANDLER
  ================================= */
  useEffect(() => {
    // Push a new history state to intercept back button
    window.history.pushState(null, null, window.location.href);

    const handlePopState = () => {
      const confirmLogout = window.confirm(
        "Are you sure you want to leave the login page? You will be logged out. ⚠️"
      );

      if (confirmLogout) {
        handleLogout();
      } else {
        // Push state again to prevent going back
        window.history.pushState(null, null, window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  /* ===============================
     SEND OTP (with password)
  ================================= */
  const sendOtp = async () => {
    setError("");

    if (!username || !password) {
      alert("Please enter username and password ❌");
      return;
    }

    // Add password validation if needed, e.g., minimum length
    if (password.length < 6) {
      alert("Password must be at least 6 characters ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(), // ✅ send password
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid credentials ❌");
      } else {
        if (data.otp) {
          alert(`OTP (dev): ${data.otp}`);
        }
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      setError("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     VERIFY OTP
  ================================= */
  const verifyOtp = async () => {
    setError("");

    if (!otp) {
      alert("Please enter OTP ❌");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      alert("OTP must be 6 digits ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid OTP ❌");
      } else {
        // ✅ LOGIN SUCCESS
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("userRole", data.role);

        // You can store token if backend returns it
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Redirect based on role
        if (data.role === "owner") {
          // Owners always have full access
          navigate("/admin");
        } else if (data.role === "admin") {
          // Check if admin has dashboard access
          if (data.dashboard_access) {
            navigate("/admin");
          } else {
            alert("You have admin privileges but dashboard access is not granted yet. Please contact the system administrator.");
            navigate("/");
          }
        } else {
          // Participant user
          localStorage.setItem("registrationStep", data.registration_step);
          if (data.registration_step === "completed") {
            navigate("/view-submission");
          } else {
            navigate("/register");
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     BACK TO PREVIOUS STEP
  ================================= */
  const handleBackStep = () => {
    setStep(step - 1);
    setOtp("");
    setError("");
  };

  /* ===============================
     LOGOUT
  ================================= */
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("registrationStep");
    localStorage.removeItem("userRole");
    setUsername("");
    setPassword("");
    setOtp("");
    setStep(1);
    setError("");
    navigate("/");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-10"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="p-8 rounded-2xl shadow-lg w-full max-w-xl bg-white/20 backdrop-blur-sm">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Login 🔐
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <div className="space-y-4">

          {/* STEP 1 → USERNAME + PASSWORD */}
          {step === 1 && (
            <>
              <input
                type="text"
                placeholder="Enter Username: jsh26xxxxx"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border p-3 rounded-lg bg-white/80"
              />

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-3 rounded-lg bg-white/80"
              />

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {/* STEP 2 → OTP */}
          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border p-3 rounded-lg bg-white/80"
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <button
                onClick={handleBackStep}
                disabled={loading}
                className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                ← Back
              </button>
            </>
          )}

          {/* REGISTER LINK */}
          <p className="text-center text-sm mt-4">
            New user?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer font-medium hover:underline"
            >
              Register here
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}