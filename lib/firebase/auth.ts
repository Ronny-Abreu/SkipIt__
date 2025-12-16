import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import type { User, UserRole } from "@/types";

export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<FirebaseUser> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  if (!user.email) {
    throw new Error("El email del usuario no está disponible");
  }

  try {
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      email: user.email,
      role: "client" as UserRole,
      name,
      createdAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error("Error al crear documento en Firestore:", error);
    throw new Error(
      `Error al crear perfil de usuario: ${error.message || error.code}`
    );
  }

  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getUserData = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) {
    return null;
  }
  const data = userDoc.data();
  return {
    id: data.id,
    email: data.email,
    role: data.role,
    name: data.name,
    phone: data.phone,
    createdAt: data.createdAt?.toDate() || new Date(),
  };
};

export const onAuthStateChange = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

