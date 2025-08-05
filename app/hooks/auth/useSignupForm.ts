// React
import { useState } from "react";

// Auth
import { userAuth } from "~/context/AuthContext";

export default function useSignupForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { signUpNewUser } = userAuth();

    // Handle sign up
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
  
      // Fresh array
      const newErrors: string[] = [];
  
      if (password !== confirmPassword) {
        newErrors.push("- Passwords do not match");
        setError(newErrors);
        setLoading(false);
        return;
      }
  
      try {
        const result = await signUpNewUser(email, password, username);
  
        if (!result.success) {
          newErrors.push("- " + result.data || "- An error occurred");
        }
  
        if (newErrors.length > 0) {
          setError(newErrors); // Combine messages into one string
        } else {
          setError([]);
          window.location.reload();
        }
      } catch (err) {
        newErrors.push("- A network or server error occurred");
        setError(newErrors);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
  

  return {
    email,
    password,
    username,
    setEmail,
    setPassword,
    setUsername,
    setConfirmPassword,
    loading,
    error,
    handleSignUp,
    setError,
  };
}
