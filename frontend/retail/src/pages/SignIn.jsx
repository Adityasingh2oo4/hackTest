import React from "react";
import HeadingText from "../components/HeadingText";
import SubheadingText from "../components/SubheadingText";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import ButtonWarning from "../components/ButtonWarning";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSignIn() {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data.accessToken, data.user || { email });
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg px-8 py-10 space-y-6">

        <div className="text-center space-y-2">
          <HeadingText text="Sign In" />
          <SubheadingText text="Enter your credentials to sign in" />
        </div>

        <div className="space-y-4">
          <InputBox
            label="Email"
            placeholder="dskter@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputBox
            label="Password"
            placeholder="••••••••"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <Button
          onClick={handleSignIn}
          buttonText={loading ? "Signing in…" : "Sign In"}
          className="w-full"
        />

        <div className="pt-2">
          <ButtonWarning
            text="Don't have an account?"
            linkTo="/signup"
            buttonText="Sign up"
          />
        </div>

      </div>

    </div>
  );
}
