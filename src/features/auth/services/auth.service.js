import { signInWithPopup, signOut } from "firebase/auth";
import { getFirebase } from "../../../lib/firebase";

export const firebaseGoogleLogin = async (role) => {
    const { auth, provider: googleProvider } = await getFirebase();
    await signOut(auth);
    sessionStorage.setItem("google_role", role);
    const result = await signInWithPopup(auth, googleProvider);
    return result;
};