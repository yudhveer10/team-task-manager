import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function OAuthCallbackPage() {
  const { token, loginWithToken } = useAuth();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const completeOAuth = async () => {
      const authToken = searchParams.get("token");

      if (!authToken) {
        setError("Missing authentication token");
        setLoading(false);
        return;
      }

      try {
        await loginWithToken(authToken);
      } catch (requestError) {
        setError(requestError.message || "Could not complete social sign-in");
      } finally {
        setLoading(false);
      }
    };

    completeOAuth();
  }, [loginWithToken, searchParams]);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return <div className="empty-state">Completing sign-in...</div>;
  }

  return <div className="empty-state">{error || "Could not complete sign-in."}</div>;
}

export default OAuthCallbackPage;
