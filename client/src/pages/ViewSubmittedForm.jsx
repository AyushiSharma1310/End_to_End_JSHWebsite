import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewSubmittedForm() {
  const navigate = useNavigate();
  const printRef = useRef();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const registrationStep = localStorage.getItem("registrationStep");

    if (!isLoggedIn || registrationStep !== "completed") {
      navigate("/");
      return;
    }

    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const username = localStorage.getItem("username");

      const res = await fetch(`http://localhost:5000/user/profile?username=${username}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to load form data");
        return;
      }

      setUserData(data.user);
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("registrationStep");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-10">
        <div className="text-gray-700 text-xl">Loading your submission...</div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-10">
        <div className="text-red-600 text-xl text-center">
          {error || "Failed to load your submission"}
          <div className="mt-6">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Your Registration Form</h1>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Submission Container */}
        <div ref={printRef} className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Print Header */}
          <div className="hidden print:block text-center py-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Jal Shakti Hackathon 2026</h2>
            <p className="text-gray-600">Registration Submission Form</p>
          </div>

          {/* Form Content */}
          <div className="p-8 max-h-[calc(100vh-300px)] overflow-y-auto">
            {/* Section 1: Basic Information */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-3 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded">{userData.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded">{userData.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded">{userData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded">{userData.mobile}</p>
                </div>
              </div>
            </div>

            {/* Section 2: Location Details */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-3 mb-4">
                Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded">{userData.state || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">District</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded">{userData.district || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded">{userData.city || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded">{userData.pincode || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Section 3: Personal Details */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-3 mb-4">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded">{userData.gender || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Section 4: Team Details */}
            {userData.team_name && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-3 mb-4">
                  Team Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Team Name</label>
                    <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded">{userData.team_name}</p>
                  </div>
                  {userData.team_members && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Team Members</label>
                      <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                        {userData.team_members}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section 5: Submission Status */}
            <div className="mb-8 print:mb-0">
              <h3 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-3 mb-4">
                Submission Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Registration Step</label>
                  <p className="text-lg font-bold text-green-600 bg-green-50 p-3 rounded">Completed ✓</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Submission Date</label>
                  <p className="text-lg text-gray-800 bg-gray-50 p-3 rounded">
                    {new Date(userData.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block text-center text-xs text-gray-500 mt-8 pt-6 border-t">
              <p>This document was generated from the Jal Shakti Hackathon 2026 registration system.</p>
              <p>Printed on {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between items-center mt-8 print:hidden">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Form
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white;
          }
          .max-w-4xl {
            max-width: 100%;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
