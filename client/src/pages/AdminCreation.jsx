import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminCreation() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    dashboard_access: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.full_name || !formData.email || !formData.mobile || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/create-admin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          dashboard_access: formData.dashboard_access,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to create admin");
        return;
      }

      alert(`Admin created successfully! Username: ${data.username}\nDashboard Access: ${data.dashboard_access ? 'Granted' : 'Not Granted'}`);
      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-10"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="p-8 rounded-2xl shadow-lg w-full max-w-xl bg-white/20 backdrop-blur-sm">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Create Admin Account
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg bg-white/80"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg bg-white/80"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              Mobile
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg bg-white/80"
              placeholder="Enter 10-digit mobile number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg bg-white/80"
              placeholder="Enter password (min 6 characters)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg bg-white/80"
              placeholder="Confirm password"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="dashboard_access"
              name="dashboard_access"
              checked={formData.dashboard_access}
              onChange={(e) => setFormData((prev) => ({
                ...prev,
                dashboard_access: e.target.checked,
              }))}
              className="mr-2"
            />
            <label htmlFor="dashboard_access" className="text-sm font-medium text-blue-600">
              Grant Dashboard Access
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating Admin..." : "Create Admin"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          This page is for creating admin accounts only. Dashboard access can be granted or revoked later from the admin dashboard.
        </p>
      </div>
    </div>
  );
}