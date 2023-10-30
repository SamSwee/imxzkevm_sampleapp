import React, { useState, useEffect } from  "react";
import { passportInstance, fetchAuth } from "../immutable";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const checkUserLoggedIn = async () => {
    const userProfile = await passportInstance.getUserInfo();
    Boolean(userProfile !== undefined) && navigate("/app")
  }
  useEffect(() => {
    checkUserLoggedIn()
  }, [])
  return (
    <>
      <h1>Immutable Passport Sample</h1>
      <div className="card">
        <button 
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await fetchAuth();
            setLoading(false);
          }}>
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </>
  )
}

export default Login
