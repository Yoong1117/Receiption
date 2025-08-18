import { userAuth } from "~/context/AuthContext";
import { useNavigate } from "react-router";

export function useSignOut() {
  const { signOut } = userAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        navigate("/");
      }
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return handleSignOut;
}