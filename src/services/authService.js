import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from '@react-native-firebase/auth';

// 👇 2. Initialize the auth instance
const authInstance = getAuth();

export const authService = {
  /**
   * Register a new user with email + password.
   * Returns { user, token }.
   */
  register: async (email, password, displayName) => {
    // Pass the authInstance as the first argument
    const credential = await createUserWithEmailAndPassword(
      authInstance,
      email,
      password,
    );

    // Update profile also takes the user object as the first argument now
    await updateProfile(credential.user, {displayName});

    const token = await credential.user.getIdToken();
    const user = {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName,
      photoURL: credential.user.photoURL,
    };
    return {user, token};
  },

  /**
   * Sign in with email + password.
   * Returns { user, token }.
   */
  login: async (email, password) => {
    const credential = await signInWithEmailAndPassword(
      authInstance,
      email,
      password,
    );
    const token = await credential.user.getIdToken();
    const user = {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
      photoURL: credential.user.photoURL,
    };
    return {user, token};
  },

  /** Sign out the current user. */
  logout: () => signOut(authInstance),

  /** Send password-reset email. */
  forgotPassword: email => sendPasswordResetEmail(authInstance, email),

  /** Return the currently signed-in Firebase user (or null). */
  currentUser: () => authInstance.currentUser,
};
