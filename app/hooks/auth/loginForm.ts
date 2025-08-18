import { useState } from "react";
import { useNavigate } from "react-router";
import { userAuth } from "~/context/AuthContext";

export default function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string[]>([]);

  const navigate = useNavigate();
  const { loginUser, signInWithGoogle } = userAuth();

  // Handle login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const newErrors: string[] = [];

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        setError([]);
        navigate("/dashboard");
      } else {
        setError([...newErrors, result.data]);
      }
    } catch (err) {
      newErrors.push("- A network or server error occurred");
      setError(newErrors);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError([]);

    try {
      const result = await signInWithGoogle();

      if (!result.success) {
        console.log("Google sign-in failed");
        setError([result.data || "- Google sign-in failed"]);
      }
    } catch (err) {
      setError(["- A network or server error occurred"]);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    loading,
    error,
    handleLogin,
    handleGoogleSignIn,
    setError,
  };
}
