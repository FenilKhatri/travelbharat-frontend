export const getFirebase = async () => {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getAuth, GoogleAuthProvider } = await import("firebase/auth");

    const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID};

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    // Asking to choose to login with an account if there are multiple accounts
    provider.setCustomParameters({
        prompt: "select_account"});

    return { auth, provider };
};
