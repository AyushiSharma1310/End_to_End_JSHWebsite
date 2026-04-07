import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreation from "./pages/AdminCreation";
import ViewSubmittedForm from "./pages/ViewSubmittedForm";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/create-admin" element={<AdminCreation />} />
        <Route path="/view-submission" element={<ViewSubmittedForm />} />
      </Routes>
    </div>
  );
}

export default App;