import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { signOut } from "firebase/auth";
import { getFirebase } from "../lib/firebase";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await authService.getMe();
      const loggedUser = res?.data?.user || null;
      setUser(loggedUser);
    } catch (error) {
      if (error?.response?.status !== 401) {
        console.error("fetchUser error:", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { auth } = await getFirebase();
      if (auth.currentUser) {
        await signOut(auth);
      }
      await authService.logout();
    } catch (error) {
      console.log("Logout error:", error);
    }
    setUser(null);
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loading, fetchUser, logout }),
    [user, loading, fetchUser, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

