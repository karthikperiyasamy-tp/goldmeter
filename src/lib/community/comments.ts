import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import type { Comment } from "@/types/community";

function commentsCol() {
  return collection(getFirebaseFirestore(), "comments");
}

export async function getComments(target: string): Promise<Comment[]> {
  const q = query(
    commentsCol(),
    where("target", "==", target)
  );
  const snap = await getDocs(q);
  const comments = snap.docs.map((d) => d.data() as Comment);
  return comments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addComment(
  target: string,
  parentId: string | null,
  uid: string,
  displayName: string,
  photoURL: string | null,
  text: string
): Promise<Comment> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const comment: Comment = {
    id,
    target,
    parentId,
    uid,
    displayName,
    photoURL,
    text,
    createdAt: now,
    updatedAt: now,
    likes: 0,
    likedBy: [],
    reported: false,
    reportedBy: [],
  };
  await setDoc(doc(commentsCol(), id), comment);
  return comment;
}

export async function editComment(
  commentId: string,
  text: string
): Promise<void> {
  const ref = doc(commentsCol(), commentId);
  await updateDoc(ref, { text, updatedAt: new Date().toISOString() });
}

export async function deleteComment(commentId: string): Promise<void> {
  await deleteDoc(doc(commentsCol(), commentId));
}

export async function toggleLike(
  commentId: string,
  uid: string,
  isLiked: boolean
): Promise<void> {
  const ref = doc(commentsCol(), commentId);
  if (isLiked) {
    await updateDoc(ref, {
      likedBy: arrayRemove(uid),
      likes: increment(-1),
    });
  } else {
    await updateDoc(ref, {
      likedBy: arrayUnion(uid),
      likes: increment(1),
    });
  }
}

export async function reportComment(
  commentId: string,
  uid: string
): Promise<void> {
  const ref = doc(commentsCol(), commentId);
  await updateDoc(ref, {
    reported: true,
    reportedBy: arrayUnion(uid),
  });
}
