"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Role = "superadmin" | "admin" | "teacher" | "student";

interface AuthUser {
  uid: string;
  email: string | null;
  userToken: string | null;
  role: Role;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const authUser: AuthUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: userData.role as Role,
            userToken: await firebaseUser.getIdToken(),
            name: userData.name,
          };
          setUser(authUser);
          localStorage.setItem("authUser", JSON.stringify(authUser));
        }
      } else {
        setUser(null);
        localStorage.removeItem("authUser");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userRef = doc(db, "users", userCredential.user.uid);
      const userDocSnap = await getDoc(userRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const authUser: AuthUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          role: userData.role as Role,
          name: userData.name,
          userToken: await userCredential.user.getIdToken(),
        };
        setUser(authUser);
        localStorage.setItem("authUser", JSON.stringify(authUser));
        setLoading(false);
        return {
          status: true,
          data: { user: authUser },
          message: "User logged in successfully",
        };
      } else {
        throw new Error("User data not found");
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        return {
          status: false,
          error: { msg: error.message },
          message: "Login failed",
        };
      } else {
        return {
          status: false,
          error: { msg: "An unknown error occurred" },
          message: "Login failed",
        };
      }
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      router.push("/login");
      setUser(null);
      localStorage.removeItem("authUser");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signOut: signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
