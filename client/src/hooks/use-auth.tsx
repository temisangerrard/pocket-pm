import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from "firebase/auth";
import { auth, initializeFirebase } from "@/lib/firebase";

type AuthContextType = {
  user: SelectUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<void>;
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

    return () => unsubscribe();
  }, [isInitialized]);

  const { data: user } = useQuery<SelectUser | null>({
    queryKey: ["/api/user", firebaseUser?.uid],
    enabled: !!firebaseUser,
  });

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
      toast({ title: "Successfully signed in with Google" });
    } catch (error: any) {
      toast({
        title: "Sign-in failed",
        description: error.message,
        variant: "destructive",
      });
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