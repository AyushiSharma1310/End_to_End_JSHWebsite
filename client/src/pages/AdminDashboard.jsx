import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logoutSession } from "../components/SessionTimer";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [userRole, setUserRole] = useState("");
  const dashboardUrl = "http://localhost:8000/admin/";

  useEffect(() => {
    // Check if user is admin or owner
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("userRole");

    if (!isLoggedIn || (role !== "admin" && role !== "owner")) {
      navigate("/");
      return;
    }

    setUserRole(role);
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const username = localStorage.getItem("username");

      const res = await fetch(`http://localhost:8000/admin/dashboard/?username=${username}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to load dashboard data");
        return;
      }

      setDashboardData(data.data);
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const username = localStorage.getItem("username");

      const res = await fetch(`http://localhost:8000/admin/participants?username=${username}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to load participants");
        return;
      }

      setParticipants(data.data);
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  const fetchAdmins = async () => {
    try {
      const username = localStorage.getItem("username");

      const res = await fetch(`http://localhost:8000/admin/list?username=${username}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to load admins");
        return;
      }

      setAdmins(data.data);
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  const grantDashboardAccess = async (adminUsername) => {
    try {
      const username = localStorage.getItem("username");

      const res = await fetch("http://localhost:8000/admin/grant-dashboard-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_username: adminUsername,
          granted_by: username,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to grant access");
        return;
      }

      alert(`Dashboard access granted to ${adminUsername}`);
      fetchAdmins(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const revokeDashboardAccess = async (adminUsername) => {
    try {
      const username = localStorage.getItem("username");

      const res = await fetch("http://localhost:8000/admin/revoke-dashboard-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_username: adminUsername,
          revoked_by: username,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to revoke access");
        return;
      }

      alert(`Dashboard access revoked from ${adminUsername}`);
      fetchAdmins(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // Owner functions
  const fetchAllUsers = async () => {
    try {
      const username = localStorage.getItem("username");

      const res = await fetch(`http://localhost:8000/owner/users?username=${username}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to load users");
        return;
      }

      setAllUsers(data.users);
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  const grantAdminAccess = async (targetUsername) => {
    try {
      const username = localStorage.getItem("username");

      const res = await fetch("http://localhost:8000/owner/grant-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          targetUsername: targetUsername,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to grant admin access");
        return;
      }

      alert(data.message);
      fetchAllUsers(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const revokeAdminAccess = async (targetUsername) => {
    if (!confirm(`Are you sure you want to revoke admin access from ${targetUsername}?`)) {
      return;
    }

    try {
      const username = localStorage.getItem("username");

      const res = await fetch("http://localhost:8000/owner/revoke-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          targetUsername: targetUsername,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to revoke admin access");
        return;
      }

      alert(data.message);
      fetchAllUsers(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleLogout = () => {
    logoutSession();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-10">
        <div className="text-gray-700 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
          <div className="flex gap-2">
            {userRole === "owner" && (
              <button
                onClick={() => window.open(dashboardUrl, "_blank")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Open Python Dashboard
              </button>
            )}
            <Link
              to="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "bg-white/20 text-blue-600 hover:bg-white/30"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              setActiveTab("participants");
              fetchParticipants();
            }}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "participants"
                ? "bg-blue-600 text-white"
                : "bg-white/20 text-blue-600 hover:bg-white/30"
            }`}
          >
            Participants
          </button>
          <button
            onClick={() => {
              setActiveTab("admins");
              fetchAdmins();
            }}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "admins"
                ? "bg-blue-600 text-white"
                : "bg-white/20 text-blue-600 hover:bg-white/30"
            }`}
          >
            Admin Management
          </button>
          {userRole === "owner" && (
            <button
              onClick={() => {
                setActiveTab("user-management");
                fetchAllUsers();
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "user-management"
                  ? "bg-blue-600 text-white"
                  : "bg-white/20 text-blue-600 hover:bg-white/30"
              }`}
            >
              User Management
            </button>
          )}
        </div>

        {/* Content */}
        {activeTab === "overview" && dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Total Participants */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Total Participants</h3>
                <p className="text-3xl font-bold text-blue-800">{dashboardData.totalParticipants}</p>
              </div>

              {/* Registration Steps */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Registration Progress</h3>
                <div className="space-y-2">
                  {dashboardData.registrationStats.map((stat) => (
                    <div key={stat.registration_step} className="flex justify-between">
                      <span className="text-sm">
                        {stat.registration_step === "1" && "Step 1"}
                        {stat.registration_step === "2" && "Step 2"}
                        {stat.registration_step === "3" && "Step 3"}
                        {stat.registration_step === "4" && "Step 4"}
                        {stat.registration_step === "completed" && "Completed"}
                      </span>
                      <span className="font-semibold">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Registrations */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Recent Registrations</h3>
                <div className="space-y-2">
                  {dashboardData.recentRegistrations.slice(0, 5).map((user) => (
                    <div key={user.username} className="text-sm">
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-gray-600">{user.username}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Registration Timeline */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-6">Registration Progress Timeline</h3>
              <div className="flex items-end justify-between gap-4 overflow-x-auto pb-4">
                {dashboardData.registrationStats.map((stat, index) => {
                  const stepLabels = {
                    "1": "Step 1",
                    "2": "Step 2",
                    "3": "Step 3",
                    "4": "Step 4",
                    "completed": "Completed"
                  };
                  
                  const maxCount = Math.max(...dashboardData.registrationStats.map(s => s.count));
                  const barHeight = (stat.count / maxCount) * 200;
                  
                  return (
                    <div key={stat.registration_step} className="flex flex-col items-center gap-3 flex-shrink-0">
                      {/* Bar */}
                      <div className="flex flex-col items-center justify-end w-20">
                        <div
                          className="w-16 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                          style={{ height: `${barHeight}px`, minHeight: "20px" }}
                        >
                          <div className="h-full flex items-center justify-center text-white font-bold text-lg">
                            {stat.count}
                          </div>
                        </div>
                      </div>
                      
                      {/* Card */}
                      <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 w-20 text-center shadow-md">
                        <div className="text-xs font-bold text-blue-700">{stepLabels[stat.registration_step]}</div>
                        <div className="text-lg font-bold text-blue-600">{stat.count}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Participants Table */}
        {activeTab === "participants" && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Participants Panel</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="text-left py-2 px-4">Username</th>
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-left py-2 px-4">Mobile</th>
                    <th className="text-left py-2 px-4">State</th>
                    <th className="text-left py-2 px-4">Role</th>
                    <th className="text-left py-2 px-4">Status</th>
                    {userRole === "owner" && (
                      <th className="text-left py-2 px-4">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.username} className="border-b border-blue-100">
                      <td className="py-2 px-4">{participant.username}</td>
                      <td className="py-2 px-4">{participant.full_name}</td>
                      <td className="py-2 px-4">{participant.email}</td>
                      <td className="py-2 px-4">{participant.mobile}</td>
                      <td className="py-2 px-4">{participant.state}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          participant.role === "admin"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {participant.role}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          participant.registration_step === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {participant.registration_step === "completed" ? "Complete" : `Step ${participant.registration_step}`}
                        </span>
                      </td>
                      {userRole === "owner" && (
                        <td className="py-2 px-4">
                          {participant.role === "admin" ? (
                            <button
                              onClick={async () => {
                                await revokeAdminAccess(participant.username);
                                fetchParticipants();
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                            >
                              Revoke Admin
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                await grantAdminAccess(participant.username);
                                fetchParticipants();
                              }}
                              className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                            >
                              Make Admin
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin Management Table */}
        {activeTab === "admins" && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Admin Management</h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage participant/admin access from one place. Owners can promote participants to admin and revoke admin access.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="text-left py-2 px-4">Username</th>
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-left py-2 px-4">Role</th>
                    <th className="text-left py-2 px-4">Dashboard Access</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.username} className="border-b border-blue-100">
                      <td className="py-2 px-4">{admin.username}</td>
                      <td className="py-2 px-4">{admin.full_name}</td>
                      <td className="py-2 px-4">{admin.email}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          admin.role === "admin"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          admin.dashboard_access
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {admin.dashboard_access ? "Granted" : "Revoked"}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {admin.role === "admin" ? (
                          admin.dashboard_access ? (
                            <button
                              onClick={async () => {
                                await revokeDashboardAccess(admin.username);
                                fetchAdmins();
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                            >
                              Revoke Dashboard
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                await grantDashboardAccess(admin.username);
                                fetchAdmins();
                              }}
                              className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                            >
                              Grant Dashboard
                            </button>
                          )
                        ) : userRole === "owner" ? (
                          <button
                            onClick={async () => {
                              await grantAdminAccess(admin.username);
                              fetchAdmins();
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">Owner only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Management Table (Owner Only) */}
        {activeTab === "user-management" && userRole === "owner" && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">User Management</h3>
            <p className="text-sm text-gray-600 mb-4">
              Grant or revoke admin privileges for users. Admins can access the dashboard, while participants have basic access only.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="text-left py-2 px-4">Username</th>
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-left py-2 px-4">Role</th>
                    <th className="text-left py-2 px-4">Dashboard Access</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user.username} className="border-b border-blue-100">
                      <td className="py-2 px-4">{user.username}</td>
                      <td className="py-2 px-4">{user.full_name}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'owner'
                            ? "bg-purple-100 text-purple-800"
                            : user.role === 'admin'
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.dashboard_access
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {user.dashboard_access ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {user.role === 'owner' ? (
                          <span className="text-xs text-gray-500">Owner (protected)</span>
                        ) : user.role === 'admin' ? (
                          <button
                            onClick={() => revokeAdminAccess(user.username)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                          >
                            Revoke Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => grantAdminAccess(user.username)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                          >
                            Grant Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

