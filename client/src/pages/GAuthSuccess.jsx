import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authStatus } from "../services/authApi";
import { useSession } from "../context/SessionContext";

export default function AuthCheck() {
  const navigate = useNavigate();
  const { login } = useSession();

  useEffect(() => {
    const checkAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const isLoginParam = params.get("login");

      if (isLoginParam === "true") {
        document.cookie =
          "isGoogleLogin=true; path=/; max-age=300; secure; samesite=none";
        // Optionally clean up the query param so URL looks clean
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const isGoogleLogin = getCookie("isGoogleLogin");
      if (!isGoogleLogin) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await authStatus();
        login(data);
        if (data.isMfaActive) {
          navigate("/verify-2fa");
        } else {
          navigate("/setup-2fa");
        }
      } catch (err) {
        console.error("Auth status check failed:", err);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, login]);

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Checking login status...</p>
    </div>
  );
}
