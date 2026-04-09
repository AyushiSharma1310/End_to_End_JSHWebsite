import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreation from "./pages/AdminCreation";
import ViewSubmittedForm from "./pages/ViewSubmittedForm";
import Gallery from "./pages/Gallery";

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
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </div>
  );
}

export default App;
