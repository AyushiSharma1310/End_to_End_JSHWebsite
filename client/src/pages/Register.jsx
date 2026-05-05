import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Step1Basic from "../components/register/Step1Basic";
import Step2Details from "../components/register/Step2Details";
import Step3Proposal from "../components/register/Step3Proposal";
import Step4Partner from "../components/register/Step4Partner";
import Step5Proposal from "../components/register/Step5Proposal";
import Step6Review from "../components/register/Step6Review";
import { logoutSession } from "../components/SessionTimer";

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
    category: "",
    organization: "",
    organization_address: "",
    project_investigator_name: "",
    project_investigator_designation: "",
    partner_organization: "",
    partner_address: "",
    partner_investigator_name: "",
    partner_investigator_email: "",
    partner_investigator_mobile: "",
    proposal_title: "",
    problem_statement: "",
    additional_info: "",
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
    // Check if user is admin and redirect if needed
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      navigate("/admin");
      return;
    }

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
        const res = await fetch(`http://localhost:8000/user-progress?username=${username}`);
        const data = await res.json();

        if (data.success) {
          const { registration_step, ...dbData } = data.data;
          setFormData((prev) => ({ ...prev, ...dbData }));

          const effectiveStep =
            registration_step === "completed"
              ? 6
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
     BROWSER BACK BUTTON HANDLER
  ================================= */
  useEffect(() => {
    // Push a new history state to intercept back button
    window.history.pushState(null, null, window.location.href);

    const handlePopState = () => {
      const confirmLogout = window.confirm(
        "Are you sure you want to leave the registration page? Your progress will be saved but you will be logged out. ⚠️"
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
      const res = await fetch("http://localhost:8000/register/", {
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
      const res = await fetch("http://localhost:8000/update-step2", {
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
     STEP 3 - PROPOSAL DETAILS
  ================================= */
  const handleStep3 = async () => {
    setError("");

    if (!formData.category || !formData.organization || !formData.organization_address || !formData.project_investigator_name || !formData.project_investigator_designation) {
      setError("Please fill all required fields for proposal details ❌");
      return;
    }

    const username = localStorage.getItem("username");

    try {
      const res = await fetch("http://localhost:8000/update-step3/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          category: formData.category,
          organization: formData.organization,
          organization_address: formData.organization_address,
          project_investigator_name: formData.project_investigator_name,
          project_investigator_designation: formData.project_investigator_designation,
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
     STEP 4 - PARTNER DETAILS
  ================================= */
  const handleStep4 = async () => {
    console.log("handleStep4 called");
    setError("");

    console.log("Form data for step 4:", {
      partner_organization: formData.partner_organization,
      partner_address: formData.partner_address,
      partner_investigator_name: formData.partner_investigator_name,
      partner_investigator_email: formData.partner_investigator_email,
      partner_investigator_mobile: formData.partner_investigator_mobile,
    });

    if (!formData.partner_organization || !formData.partner_address || !formData.partner_investigator_name || !formData.partner_investigator_email || !formData.partner_investigator_mobile) {
      setError("Please fill all required fields for partner details ❌");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.partner_investigator_email)) {
      setError("Please enter a valid email for partner investigator ❌");
      return;
    }

    if (!/^\d{10}$/.test(formData.partner_investigator_mobile)) {
      console.log("Mobile validation failed. Mobile value:", formData.partner_investigator_mobile);
      setError("Partner investigator mobile number must be exactly 10 digits ❌");
      return;
    }

    const username = localStorage.getItem("username");
    console.log("Username:", username);

    try {
      console.log("Making fetch request to update-step4");
      const res = await fetch("http://localhost:8000/update-step4/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          partner_organization: formData.partner_organization,
          partner_address: formData.partner_address,
          partner_investigator_name: formData.partner_investigator_name,
          partner_investigator_email: formData.partner_investigator_email,
          partner_investigator_mobile: formData.partner_investigator_mobile,
        }),
      });

      console.log("Fetch response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (!data.success) {
        setError(data.message || "Step 4 update failed ❌");
        return;
      }

      setStep(5);
      localStorage.setItem("registrationStep", "5");
    } catch (error) {
      console.error("Error in handleStep4:", error);
      setError("Server error ❌");
    }
  };

  /* ===============================
     STEP 5 - PROPOSAL CONTENT
  ================================= */
  const handleStep5 = async () => {
    console.log("handleStep5 called");
    setError("");

    console.log("Form data for step 5:", {
      proposal_title: formData.proposal_title,
      problem_statement: formData.problem_statement,
      additional_info: formData.additional_info,
    });

    if (!formData.proposal_title || !formData.problem_statement || !formData.additional_info) {
      setError("Please fill all required fields for proposal content ❌");
      return;
    }

    if (formData.proposal_title.length > 100) { // Approximately 20 words limit
      setError("Proposal title must be maximum 20 words (100 characters) ❌");
      return;
    }

    if (formData.problem_statement.length > 2500) { // Approximately 500 words
      setError("Problem statement must be maximum 500 words (2500 characters) ❌");
      return;
    }

    if (formData.additional_info.length > 1500) { // Approximately 300 words
      setError("Additional info must be maximum 300 words (1500 characters) ❌");
      return;
    }

    const username = localStorage.getItem("username");
    console.log("Username:", username);

    try {
      console.log("Making fetch request to update-step5");
      const res = await fetch("http://localhost:8000/update-step5/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          proposal_title: formData.proposal_title,
          problem_statement: formData.problem_statement,
          additional_info: formData.additional_info,
        }),
      });

      console.log("Fetch response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (!data.success) {
        setError(data.message || "Step 5 update failed ❌");
        return;
      }

      setStep(6);
      localStorage.setItem("registrationStep", "6");
    } catch (error) {
      console.error("Error in handleStep5:", error);
      setError("Server error ❌");
    }
  };

  /* ===============================
     FINAL STEP 6
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
      const res = await fetch("http://localhost:8000/final-submit/", {
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
    logoutSession();
    navigate("/");
  };

  /* ===============================
     SAVE (WITHOUT ADVANCING)
  ================================= */
  const handleSave = async () => {
    console.log("handleSave called, current step:", step);
    setError("");
    const username = localStorage.getItem("username");
    console.log("Username from localStorage:", username);

    if (!username) {
      setError("Please complete step 1 first ❌");
      return;
    }

    localStorage.setItem("registrationStep", step.toString());

    if (step === 1) {
      alert("Step 1 saved locally ✅");
    } else if (step === 2) {
      console.log("Calling handleStep2SaveOnly");
      await handleStep2SaveOnly();
    } else if (step === 3) {
      console.log("Calling handleStep3SaveOnly");
      await handleStep3SaveOnly();
    } else if (step === 4) {
      console.log("Calling handleStep4SaveOnly");
      await handleStep4SaveOnly();
    } else if (step === 5) {
      console.log("Calling handleStep5SaveOnly");
      await handleStep5SaveOnly();
    } else if (step === 6) {
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
      const res = await fetch("http://localhost:8000/update-step2", {
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
    console.log("handleStep3SaveOnly called");
    const username = localStorage.getItem("username");

    try {
      const res = await fetch("http://localhost:8000/update-step3/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          category: formData.category,
          organization: formData.organization,
          organization_address: formData.organization_address,
          project_investigator_name: formData.project_investigator_name,
          project_investigator_designation: formData.project_investigator_designation,
        }),
      });

      const data = await res.json();
      console.log("Response from server:", data);

      if (!data.success) {
        setError(data.message || "Save failed ❌");
        return;
      }

      localStorage.setItem("registrationStep", step.toString());
      alert("Step 3 data saved ✅");
    } catch (error) {
      console.error("Error in handleStep3SaveOnly:", error);
      setError("Server error ❌");
    }
  };

  /* ===============================
     STEP 4 SAVE ONLY
  ================================= */
  const handleStep4SaveOnly = async () => {
    console.log("handleStep4SaveOnly called");
    const username = localStorage.getItem("username");
    console.log("Username:", username);
    console.log("Form data:", formData);

    try {
      console.log("Making fetch request to update-step4 for save");
      const res = await fetch("http://localhost:8000/update-step4/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          partner_organization: formData.partner_organization,
          partner_address: formData.partner_address,
          partner_investigator_name: formData.partner_investigator_name,
          partner_investigator_email: formData.partner_investigator_email,
          partner_investigator_mobile: formData.partner_investigator_mobile,
        }),
      });

      console.log("Fetch response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (!data.success) {
        setError(data.message || "Save failed ❌");
        return;
      }

      localStorage.setItem("registrationStep", step.toString());
      alert("Step 4 data saved ✅");
    } catch (error) {
      console.error("Error in handleStep4SaveOnly:", error);
      setError("Server error ❌");
    }
  };

  /* ===============================
     STEP 5 SAVE ONLY
  ================================= */
  const handleStep5SaveOnly = async () => {
    const username = localStorage.getItem("username");

    try {
      const res = await fetch("http://localhost:8000/update-step5/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          proposal_title: formData.proposal_title,
          problem_statement: formData.problem_statement,
          additional_info: formData.additional_info,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Save failed ❌");
        return;
      }

      localStorage.setItem("registrationStep", step.toString());
      alert("Step 5 data saved ✅");
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
              Step {step} of 6
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
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

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleStep2}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
                  >
                    Next →
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <Step3Proposal
                  formData={formData}
                  handleChange={handleChange}
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleStep3}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
                  >
                    Next →
                  </button>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <Step4Partner
                  formData={formData}
                  handleChange={handleChange}
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleStep4}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
                  >
                    Next →
                  </button>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <Step5Proposal
                  formData={formData}
                  handleChange={handleChange}
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleStep5}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
                  >
                    Next →
                  </button>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <Step6Review
                  formData={formData}
                  handleSubmit={handleSubmit}
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
                  >
                    ← Previous
                  </button>
                </div>
              </>
            )}

          </form>
        )}
      </div>
    </div>
  );
}
