import { createContext, useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { getFirebase } from "../lib/firebase";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
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
  };

  const logout = async () => {
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
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

