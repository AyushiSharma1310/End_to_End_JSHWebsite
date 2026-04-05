import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    team: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData); // 👉 later send to backend

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Back Button */}
        <Link to="/" className="text-blue-600 text-sm mb-4 block">
          ← Back to Home
        </Link>

        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Register for Hackathon 🚀
        </h1>

        {submitted ? (
          <p className="text-green-600 text-center font-medium">
            ✅ Registered Successfully!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="college"
              placeholder="College / Organization"
              value={formData.college}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="team"
              placeholder="Team Name"
              value={formData.team}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>

          </form>
        )}

      </div>

    </div>
  );
}

// export default function Register() {
//   return <h1>Register Page Working ✅</h1>;
// }