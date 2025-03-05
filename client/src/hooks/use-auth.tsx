import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: SelectUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user?.email);
      setFirebaseUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data when Firebase user changes
  const { data: user } = useQuery<SelectUser | null>({
    queryKey: ["/api/user", firebaseUser?.uid],
    enabled: !!firebaseUser,
  });

  const handleError = (error: any, defaultMessage: string) => {
    console.error('Auth error:', error);
    let message = defaultMessage;

    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      message = "Invalid email or password";
    } else if (error.code === 'auth/email-already-in-use') {
      message = "Email is already registered";
    } else if (error.code === 'auth/weak-password') {
      message = "Password is too weak";
    } else if (error.code === 'auth/invalid-email') {
      message = "Invalid email format";
    } else if (error.code === 'auth/network-request-failed') {
      message = "Network error occurred";
    }

    toast({
      title: "Authentication Error",
      description: message,
      variant: "destructive",
    });
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user.email);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        handleError(error, "Failed to sign in with Google");
      }
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log("Attempting email sign-in:", email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Email sign-in successful:", result.user.email);
    } catch (error: any) {
      handleError(error, "Failed to sign in");
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      console.log("Attempting email sign-up:", email);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      console.log("Email sign-up successful:", user.email);
    } catch (error: any) {
      handleError(error, "Failed to create account");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      queryClient.clear();
      toast({ title: "Successfully logged out" });
    } catch (error: any) {
      handleError(error, "Failed to log out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}