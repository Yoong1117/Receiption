// React
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Supabase client
import { supabase } from "~/supabase/supabaseClient";

const supabaseUrl =
  import.meta.env.VITE_APP_URL || "https://receiptionv1.vercel.app";

interface AuthContextType {
  session: any;
  loading: boolean;
  userId: string | null;
  setSession: React.Dispatch<React.SetStateAction<any>>;
  signUpNewUser: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ success: boolean; data?: any }>;
  loginUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: any }>;
  signInWithGoogle: () => Promise<{ success: boolean; data?: any }>;
  signOut: () => Promise<{ success: boolean; data?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  // Sign up
  const signUpNewUser = async (
    email: string,
    password: string,
    username: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      console.error("Error signing up:", error);
      return { success: false, data: error.message };
    }

    return { success: true, data };
  };

  // login
  const loginUser = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; data?: any }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in failed: ", error);
      return { success: false, data: error.message };
    }

    return { success: true, data };
  };

  // Google sign in
  const signInWithGoogle = async (): Promise<{
    success: boolean;
    data?: any;
  }> => {
    console.log("Redirecting to:", `${supabaseUrl}/dashboard`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${supabaseUrl}/dashboard`,
      },
    });

    if (error) {
      console.error("Google sign in failed: ", error);
      return { success: false, data: error.message };
    }

    console.log("Google sign in data:", data);
    return { success: true, data };
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(`there was an error: `, error);
      return { success: false, data: error.message };
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        userId,
        setSession,
        signUpNewUser,
        loginUser,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return context;
};
