import React from "react";
import HeadingText from "../components/HeadingText";
import SubheadingText from "../components/SubheadingText";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import ButtonWarning from "../components/ButtonWarning";
import { registerUser } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function SignUp() {
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSignUp() {
    setError("")
    if (!firstName || !email || !password) {
      setError("First name, email and password are required.")
      return
    }
    setLoading(true)
    try {
      const data = await registerUser({
        email,
        password,
        fullName: `${firstName} ${lastName}`.trim(),
      })
      login(data.accessToken, data.user || { email })
      navigate("/")
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg px-8 py-10 space-y-6">

        <div className="text-center space-y-2">
          <HeadingText text="Create Account" />
          <SubheadingText text="Enter your credentials to sign up" />
        </div>

        <div className="space-y-4">
          <InputBox
            label="First Name"
            placeholder="Agent"
            onChange={(e) => setFirstName(e.target.value)}
          />

          <InputBox
            label="Last Name"
            placeholder="Smith"
            onChange={(e) => setLastName(e.target.value)}
          />

          <InputBox
            label="Email"
            placeholder="dskter@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputBox
            label="Password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <Button
          onClick={handleSignUp}
          buttonText={loading ? "Signing up…" : "Sign Up"}
          className="w-full"
        />

        <div className="pt-2">
          <ButtonWarning
            text="Already have an account?"
            linkTo="/signin"
            buttonText="Sign in"
          />
        </div>

      </div>
    </div>
  );
}

