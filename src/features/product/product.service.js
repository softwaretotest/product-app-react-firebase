import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const uploadImage = async (file) => {
  const storageRef = ref(storage, "images/" + Date.now());
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  return url;
};

export const getProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addProduct = async (data) => {
  const docRef = await addDoc(collection(db, "products"), data);
  return docRef.id;
};

export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, "products", id));
};

export const updateProduct = async (id, data) => {
  await updateDoc(doc(db, "products", id), data);
};
