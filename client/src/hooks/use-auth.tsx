import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
  type User as FirebaseUser
} from "firebase/auth";
import { auth, initializeFirebase } from "@/lib/firebase";

type AuthContextType = {
  user: SelectUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Firebase
    initializeFirebase().then(() => {
      setIsInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsLoading(false);
    });

    // Check for redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          toast({ title: "Successfully signed in with Google" });
        }
      })
      .catch((error) => {
        handleAuthError(error);
      });

    return () => unsubscribe();
  }, [isInitialized]);

  const { data: user } = useQuery<SelectUser | null>({
    queryKey: ["/api/user", firebaseUser?.uid],
    enabled: !!firebaseUser,
  });

  const handleAuthError = (error: any) => {
    let message = "Authentication failed";
    if (error.code === 'auth/popup-closed-by-user') {
      message = "Sign-in window was closed";
    } else if (error.code === 'auth/popup-blocked') {
      // If popup is blocked, we'll use redirect method instead
      return true;
    } else if (error.code === 'auth/email-already-in-use') {
      message = "Email already in use. Please sign in instead.";
    } else if (error.code === 'auth/invalid-email') {
      message = "Invalid email address";
    } else if (error.code === 'auth/wrong-password') {
      message = "Incorrect password";
    } else if (error.code === 'auth/user-not-found') {
      message = "No account found with this email";
    } else if (error.code === 'auth/weak-password') {
      message = "Password should be at least 6 characters";
    } else if (error.code === 'auth/network-request-failed') {
      message = "Network error. Please check your connection";
    }

    toast({
      title: "Authentication Error",
      description: message,
      variant: "destructive",
    });
    return false;
  };

  const signInWithGoogle = async () => {
    if (!isInitialized) {
      toast({
        title: "Error",
        description: "Authentication system is still initializing",
        variant: "destructive",
      });
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (handleAuthError(error)) {
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
      }
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isInitialized) {
      toast({
        title: "Error",
        description: "Authentication system is still initializing",
        variant: "destructive",
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Successfully signed in" });
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    if (!isInitialized) {
      toast({
        title: "Error",
        description: "Authentication system is still initializing",
        variant: "destructive",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      toast({ title: "Account created successfully" });
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const logout = async () => {
    if (!isInitialized) return;

    try {
      await signOut(auth);
      queryClient.clear();
      toast({ title: "Successfully logged out" });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading: isLoading || !isInitialized,
        error: null,
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