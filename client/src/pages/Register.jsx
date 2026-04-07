import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Step1Basic from "../components/register/Step1Basic";
import Step2Details from "../components/register/Step2Details";
import Step3Team from "../components/register/Step3Team";
import Step4Submission from "../components/register/Step4Submission";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [generatedUsername, setGeneratedUsername] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    gender: "",
    password: "",
    confirmPassword: "",
    team_name: "",
    team_members: "",
  });

  const [captcha, setCaptcha] = useState({ question: "", answer: 0 });
  const [userCaptcha, setUserCaptcha] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  /* ===============================
     ROUTE CONTROL (UPDATED)
  ================================= */
  useEffect(() => {
    const savedStep = localStorage.getItem("registrationStep");
    const savedData = localStorage.getItem("formData");
    const username = localStorage.getItem("username");
    const initialStep = savedStep ? parseInt(savedStep) : 1;

    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (err) {
        console.error("Failed to parse saved form data", err);
      }
    }

    const restoreProgress = async () => {
      if (!username) {
        setStep(initialStep);
        generateCaptcha();
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/user-progress?username=${username}`);
        const data = await res.json();

        if (data.success) {
          const { registration_step, ...dbData } = data.data;
          setFormData((prev) => ({ ...prev, ...dbData }));

          const effectiveStep =
            registration_step === "completed"
              ? 4
              : Number(registration_step) || initialStep;

          if (registration_step === "completed") {
            setSubmitted(true);
          }

          setStep(effectiveStep);
          localStorage.setItem("registrationStep", effectiveStep.toString());
        } else {
          setStep(initialStep);
        }
      } catch (err) {
        console.error("Failed to restore progress from DB", err);
        setStep(initialStep);
      } finally {
        generateCaptcha();
      }
    };

    restoreProgress();
  }, []);

  /* ===============================
     AUTO SAVE
  ================================= */
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  /* ===============================
     FIELD CHANGE HANDLER
  ================================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===============================
     CAPTCHA
  ================================= */
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);

    setCaptcha({
      question: `${num1} + ${num2}`,
      answer: num1 + num2,
    });
  };

  /* ===============================
     PINCODE API
  ================================= */
  const fetchLocationFromPincode = async (pincode) => {
    if (pincode.length !== 6) return;

    setLoadingLocation(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await res.json();

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        setFormData((prev) => ({
          ...prev,
          state: postOffice.State,
          district: postOffice.District,
          city: postOffice.Block || postOffice.Name,
        }));
      } else {
        setError("Invalid Pincode ❌");
      }
    } catch {
      setError("Error fetching location ❌");
    }

    setLoadingLocation(false);
  };

  /* ===============================
     STEP 1
  ================================= */
  const handleInitialRegister = async () => {
    setError("");

    if (!formData.full_name || !formData.email || !formData.mobile) {
      alert("Please fill all required fields ❌");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email ❌");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      alert("Mobile number must be exactly 10 digits ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          mobile: formData.mobile,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Registration failed ❌");
        return;
      }

      setGeneratedUsername(data.username);

      localStorage.setItem("registeredUser", data.username);
      localStorage.setItem("username", data.username);

      // ✅ Mark user as registered
      localStorage.setItem("isRegistered", "true");

      // ✅ Move to step 2 instead of navigating away
      setStep(2);
      localStorage.setItem("registrationStep", "2");

      alert(`🎉 Username: ${data.username}`);
    } catch {
      setError("Registration failed ❌");
    }
  };

  /* ===============================
     STEP 2
  ================================= */
  const handleStep2 = async () => {
    setError("");

    if (String(userCaptcha).trim() !== String(captcha.answer)) {
      setError("Captcha answer is incorrect ❌");
      return;
    }

    if (!formData.pincode || formData.pincode.length !== 6) {
      setError("Enter a valid 6-digit pincode ❌");
      return;
    }

    if (!formData.gender) {
      setError("Please select a gender ❌");
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      setError("Please enter and confirm your password ❌");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters ❌");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    const username = localStorage.getItem("username");

    try {
      const res = await fetch("http://localhost:5000/update-step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          state: formData.state,
          district: formData.district,
          city: formData.city,
          pincode: formData.pincode,
          gender: formData.gender,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Step 2 update failed ❌");
        return;
      }

      setStep(3);
      localStorage.setItem("registrationStep", "3");
    } catch {
      setError("Server error ❌");
    }
  };

  /* ===============================
     STEP 3
  ================================= */
  const handleStep3 = async () => {
    const username = localStorage.getItem("username");

    try {
      const res = await fetch("http://localhost:5000/update-step3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          team_name: formData.team_name,
          team_members: formData.team_members,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Step 3 update failed ❌");
        return;
      }

      setStep(4);
      localStorage.setItem("registrationStep", "4");
    } catch {
      setError("Server error ❌");
    }
  };

  /* ===============================
     FINAL STEP 4
  ================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = localStorage.getItem("username");

    if (!username) {
      setError("User not found ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/final-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Submission failed ❌");
        return;
      }

      setSubmitted(true);

      localStorage.removeItem("registrationStep");
      localStorage.removeItem("formData");

      alert("🎉 Registration Complete!");
    } catch {
      setError("Server error ❌");
    }
  };

  /* ===============================
     LOGOUT
  ================================= */
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ===============================
     SAVE (WITHOUT ADVANCING)
  ================================= */
  const handleSave = async () => {
    setError("");
    localStorage.setItem("registrationStep", step.toString());

    if (step === 1) {
      alert("Step 1 saved locally ✅");
    } else if (step === 2) {
      await handleStep2SaveOnly();
    } else if (step === 3) {
      await handleStep3SaveOnly();
    } else if (step === 4) {
      alert("Final step - no save needed ✅");
    }
  };

  /* ===============================
     STEP 2 SAVE ONLY
  ================================= */
  const handleStep2SaveOnly = async () => {
    if (String(userCaptcha).trim() !== String(captcha.answer)) {
      setError("Captcha answer is incorrect ❌");
      return;
    }

    if (!formData.pincode || formData.pincode.length !== 6) {
      setError("Enter a valid 6-digit pincode ❌");
      return;
    }

    if (!formData.gender) {
      setError("Please select a gender ❌");
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      setError("Please enter and confirm your password ❌");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters ❌");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    const username = localStorage.getItem("username");

    try {
      const res = await fetch("http://localhost:5000/update-step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          state: formData.state,
          district: formData.district,
          city: formData.city,
          pincode: formData.pincode,
          gender: formData.gender,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Save failed ❌");
        return;
      }

      localStorage.setItem("registrationStep", step.toString());
      alert("Step 2 data saved ✅");
    } catch {
      setError("Server error ❌");
    }
  };

  /* ===============================
     STEP 3 SAVE ONLY
  ================================= */
  const handleStep3SaveOnly = async () => {
    const username = localStorage.getItem("username");

    try {
      const res = await fetch("http://localhost:5000/update-step3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          team_name: formData.team_name,
          team_members: formData.team_members,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Save failed ❌");
        return;
      }

      localStorage.setItem("registrationStep", step.toString());
      alert("Step 3 data saved ✅");
    } catch {
      setError("Server error ❌");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-10"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="p-8 rounded-2xl shadow-lg w-full max-w-xl bg-white/20 backdrop-blur-sm">

        <Link to="/" className="text-blue-600 text-sm mb-4 block">
          ← Back to Login
        </Link>

        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Register for Hackathon 🚀
        </h1>

        {!submitted && (
          <div className="flex justify-between mb-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Save
            </button>
          </div>
        )}

        {!submitted && (
          <div className="mb-6">
            <div className="text-center text-blue-600 font-semibold mb-2">
              Step {step} of 4
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        {submitted ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              ✅ Registration Completed!
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form className="space-y-4">

            {step === 1 && (
              <Step1Basic
                formData={formData}
                handleChange={handleChange}
                nextStep={handleInitialRegister}
              />
            )}

            {step === 2 && (
              <>
                <Step2Details
                  formData={formData}
                  handleChange={handleChange}
                  fetchLocationFromPincode={fetchLocationFromPincode}
                  loadingLocation={loadingLocation}
                  captcha={captcha}
                  userCaptcha={userCaptcha}
                  setUserCaptcha={setUserCaptcha}
                />

                <button
                  type="button"
                  onClick={handleStep2}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg"
                >
                  Next →
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <Step3Team
                  formData={formData}
                  handleChange={handleChange}
                />

                <button
                  type="button"
                  onClick={handleStep3}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg"
                >
                  Next →
                </button>
              </>
            )}

            {step === 4 && (
              <Step4Submission handleSubmit={handleSubmit} />
            )}

          </form>
        )}
      </div>
    </div>
  );
}