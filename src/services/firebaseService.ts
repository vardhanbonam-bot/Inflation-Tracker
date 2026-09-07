import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth, googleProvider, signInWithPopup, signOut, signInAnonymously, type User } from '../lib/firebase';
import { Profile, Expense, Category, PriceObservation } from '../types';

/**
 * Authentication Helpers
 */
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

export async function loginAnonymously(): Promise<User | null> {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Anonymous sign-in failed:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out failed:', error);
    throw error;
  }
}

/**
 * User Profile Firestore Sync
 */
export async function syncUserProfileToFirestore(userId: string, profile: Profile): Promise<void> {
  if (!userId) return;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...profile,
      id: userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error syncing profile to Firestore:', error);
  }
}

export async function fetchUserProfileFromFirestore(userId: string): Promise<Partial<Profile> | null> {
  if (!userId) return null;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as Partial<Profile>;
    }
  } catch (error) {
    console.error('Error fetching user profile from Firestore:', error);
  }
  return null;
}

/**
 * Expenses Firestore Sync
 */
export function subscribeToExpenses(
  userId: string,
  onUpdate: (expenses: Expense[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!userId) {
    return () => {};
  }
  const expensesRef = collection(db, 'users', userId, 'expenses');
  const q = query(expensesRef, orderBy('date', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const items: Expense[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        amount: Number(data.amount) || 0,
        categoryId: data.categoryId || 'other',
        subcategory: data.subcategory || '',
        item: data.item || '',
        note: data.note || '',
        date: data.date || new Date().toISOString().split('T')[0]
      });
    });
    onUpdate(items);
  }, (err) => {
    console.warn('Firestore expenses subscription error:', err);
    if (onError) onError(err);
  });
}

export async function addExpenseToFirestore(userId: string, expense: Omit<Expense, 'id'> & { id?: string }): Promise<string> {
  if (!userId) throw new Error('User not authenticated');
  const expensesRef = collection(db, 'users', userId, 'expenses');
  
  if (expense.id) {
    const docRef = doc(db, 'users', userId, 'expenses', expense.id);
    await setDoc(docRef, {
      ...expense,
      updatedAt: serverTimestamp()
    });
    return expense.id;
  } else {
    const docRef = await addDoc(expensesRef, {
      ...expense,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }
}

export async function updateExpenseInFirestore(userId: string, id: string, updates: Partial<Expense>): Promise<void> {
  if (!userId || !id) return;
  const docRef = doc(db, 'users', userId, 'expenses', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteExpenseFromFirestore(userId: string, id: string): Promise<void> {
  if (!userId || !id) return;
  const docRef = doc(db, 'users', userId, 'expenses', id);
  await deleteDoc(docRef);
}

/**
 * Bulk Sync to Firestore (e.g. initial migration or user click to sync)
 */
export async function seedInitialFirestoreData(
  userId: string, 
  expenses: Expense[],
  profile: Profile
): Promise<{ success: boolean; count: number }> {
  if (!userId) return { success: false, count: 0 };
  
  try {
    // 1. Sync Profile
    await syncUserProfileToFirestore(userId, profile);

    // 2. Sync Expenses
    let count = 0;
    for (const exp of expenses) {
      const docRef = doc(db, 'users', userId, 'expenses', exp.id);
      await setDoc(docRef, {
        ...exp,
        syncedAt: new Date().toISOString()
      }, { merge: true });
      count++;
    }

    return { success: true, count };
  } catch (error) {
    console.error('Bulk sync to Firestore failed:', error);
    return { success: false, count: 0 };
  }
}
