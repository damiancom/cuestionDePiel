import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

/**
 * Inicia sesión con email y password usando Firebase Auth.
 * @returns {Promise<boolean>} true si el login fue exitoso
 */
export async function login(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
  return true;
}

/**
 * Cierra la sesión del usuario actual.
 */
export async function logout() {
  await signOut(auth);
}

/**
 * Verifica si hay un usuario autenticado actualmente.
 */
export function isAuthenticated() {
  return !!auth.currentUser;
}

/**
 * Obtiene el ID Token JWT del usuario actual para enviarlo al backend.
 * @returns {Promise<string|null>}
 */
export async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

/**
 * Espera a que Firebase resuelva el estado de autenticación.
 * Útil para el router guard al cargar la app por primera vez.
 * @returns {Promise<import('firebase/auth').User|null>}
 */
export function waitForAuth() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}
