import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./config";

type AuthResult = { success: boolean; error?: string };

function getAuthErrorMessage(error: unknown, mode: "signIn" | "signUp") {
  const code =
    error && typeof error === "object" && "code" in error
      ? error.code
      : undefined;

  if (mode === "signUp") {
    switch (code) {
      case "auth/email-already-in-use":
        return "An account already exists with this email.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
    }
  } else if (
    code === "auth/invalid-credential" ||
    code === "auth/wrong-password" ||
    code === "auth/user-not-found"
  ) {
    return "Incorrect email or password";
  }

  return "Something went wrong. Try again.";
}

export async function signUp(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: getAuthErrorMessage(error, "signUp") };
  }
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: getAuthErrorMessage(error, "signIn") };
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}
