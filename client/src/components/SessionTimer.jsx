import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SESSION_DURATION_MS = 10 * 60 * 1000;
const SESSION_EXPIRES_AT_KEY = "sessionExpiresAt";

function clearSession() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("token");
  localStorage.removeItem("registrationStep");
  localStorage.removeItem("userRole");
  localStorage.removeItem("formData");
  localStorage.removeItem(SESSION_EXPIRES_AT_KEY);
}

function formatTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function startSessionTimer() {
  localStorage.setItem(
    SESSION_EXPIRES_AT_KEY,
    String(Date.now() + SESSION_DURATION_MS)
  );
}

export function logoutSession() {
  clearSession();
}

export default function SessionTimer() {
  const navigate = useNavigate();
  const [remainingMs, setRemainingMs] = useState(null);

  useEffect(() => {
    const tick = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (!isLoggedIn) {
        setRemainingMs(null);
        return;
      }

      let expiresAt = Number(localStorage.getItem(SESSION_EXPIRES_AT_KEY));

      if (!expiresAt) {
        expiresAt = Date.now() + SESSION_DURATION_MS;
        localStorage.setItem(SESSION_EXPIRES_AT_KEY, String(expiresAt));
      }

      const timeLeft = expiresAt - Date.now();

      if (timeLeft <= 0) {
        clearSession();
        setRemainingMs(null);
        alert("Your 10 minute session has expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }

      setRemainingMs(timeLeft);
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  if (remainingMs === null) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
      Session: {formatTime(remainingMs)}
    </div>
  );
}
